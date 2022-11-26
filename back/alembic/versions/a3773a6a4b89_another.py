"""another

Revision ID: a3773a6a4b89
Revises: 0278da47669c
Create Date: 2022-11-12 18:11:12.415053

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a3773a6a4b89'
down_revision = '0278da47669c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('label_word',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=255), nullable=False),
    sa.Column('label_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['label_id'], ['label.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('label_words')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('label_words',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('text', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('label_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['label_id'], ['label.id'], name='label_words_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.drop_table('label_word')
    # ### end Alembic commands ###