"""another

Revision ID: 0278da47669c
Revises: fa9f1427de35
Create Date: 2022-11-12 17:56:35.206369

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0278da47669c'
down_revision = 'fa9f1427de35'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('word', sa.Column('file_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'word', 'file', ['file_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'word', type_='foreignkey')
    op.drop_column('word', 'file_id')
    # ### end Alembic commands ###