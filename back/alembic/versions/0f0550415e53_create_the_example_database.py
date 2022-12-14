"""Create the example Database

Revision ID: 0f0550415e53
Revises: a3773a6a4b89
Create Date: 2022-11-12 18:47:03.397256

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f0550415e53'
down_revision = 'a3773a6a4b89'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('label_word_ibfk_1', 'label_word', type_='foreignkey')
    op.create_foreign_key(None, 'label_word', 'label', ['label_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'label_word', type_='foreignkey')
    op.create_foreign_key('label_word_ibfk_1', 'label_word', 'label', ['label_id'], ['id'])
    # ### end Alembic commands ###
