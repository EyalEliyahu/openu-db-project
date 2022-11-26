"""Create the example Database

Revision ID: 733283ff48e3
Revises: 0f0550415e53
Create Date: 2022-11-14 21:55:16.862593

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '733283ff48e3'
down_revision = '0f0550415e53'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('word', sa.Column('startChar', sa.String(length=1), nullable=False))
    op.add_column('word', sa.Column('endChar', sa.String(length=1), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('word', 'endChar')
    op.drop_column('word', 'startChar')
    # ### end Alembic commands ###