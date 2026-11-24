from sqlalchemy.orm import DeclarativeBase


class Table(DeclarativeBase):
    """Base for every table. Alembic reads `Table.metadata` to autogenerate migrations."""
