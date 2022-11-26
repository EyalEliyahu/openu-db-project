"""init

Revision ID: 102836fa67d4
Revises: 
Create Date: 2022-11-12 17:42:00.967513

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '102836fa67d4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('expression',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('file',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('author', sa.String(length=255), nullable=False),
    sa.Column('uploadedAt', sa.String(length=255), nullable=False),
    sa.Column('publishedAt', sa.String(length=255), nullable=False),
    sa.Column('fileName', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('label',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('word',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=255), nullable=False),
    sa.Column('page', sa.Integer(), nullable=False),
    sa.Column('row', sa.Integer(), nullable=False),
    sa.Column('pageRowStartIndex', sa.Integer(), nullable=False),
    sa.Column('paragraph', sa.Integer(), nullable=False),
    sa.Column('sentence', sa.Integer(), nullable=False),
    sa.Column('paragraphSentenceStartIndex', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('word')
    op.drop_table('label')
    op.drop_table('file')
    op.drop_table('expression')
    # ### end Alembic commands ###
