from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from database import get_db
from models import User, UserFavorite
from schemas import WatchlistItemCreate, WatchlistItemResponse
from security import decode_token

router = APIRouter(prefix="/watchlist")


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """
    Dependency to get current authenticated user from Bearer token.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Parse Bearer token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    # Decode token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.get("", response_model=list[WatchlistItemResponse])
async def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all watchlist items for the current user.
    """
    favorites = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).all()
    return favorites


@router.post("", response_model=WatchlistItemResponse, status_code=201)
async def add_to_watchlist(
    item: WatchlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add a symbol to the user's watchlist.
    Maximum 50 symbols per user.
    """
    # Check existing count
    count = db.query(UserFavorite).filter(UserFavorite.user_id == current_user.id).count()
    if count >= 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Maximum 50 symbols allowed per user",
        )

    # Create new favorite
    try:
        new_favorite = UserFavorite(
            user_id=current_user.id,
            symbol=item.symbol.upper(),
        )
        db.add(new_favorite)
        db.commit()
        db.refresh(new_favorite)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Symbol already in watchlist",
        )

    return new_favorite


@router.delete("/{item_id}", status_code=204)
async def remove_from_watchlist(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove a symbol from the user's watchlist.
    """
    # Find and verify ownership
    favorite = db.query(UserFavorite).filter(UserFavorite.id == item_id).first()
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if favorite.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item",
        )

    # Delete
    db.delete(favorite)
    db.commit()

    return None
