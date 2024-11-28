# from typing import AsyncIterator
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy import MetaData

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from .variables import DATABASE_URL

Base = declarative_base()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)


# engine = create_async_engine(DATABASE_URL, future=True, echo=True)


# session = sessionmaker(bind=engine)
# async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# async def get_session() -> AsyncIterator[async_sessionmaker]:
#     try:
#         yield async_session
#     except SQLAlchemyError as e:
#         print("Async Session Error", e)

# convention = {
#     'all_column_names': lambda constraint, table: '_'.join([
#         column.name for column in constraint.columns.values()
#     ]),
#     'ix': 'ix__%(table_name)s__%(all_column_names)s',
#     'uq': 'uq__%(table_name)s__%(all_column_names)s',
#     'ck': 'ck__%(table_name)s__%(constraint_name)s',
#     'fk': (
#         'fk__%(table_name)s__%(all_column_names)s__'
#         '%(referred_table_name)s'
#     ),
#     'pk': 'pk__%(table_name)s'
# }

# # Registry for all tables
# metadata = MetaData(naming_convention=convention)