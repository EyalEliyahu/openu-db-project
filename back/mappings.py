import json

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Word(Base):
    __tablename__ = 'word'

    id = Column(Integer, primary_key=True)
    text = Column(String(255), nullable=False)
    startChar = Column(String(1), nullable=False)
    endChar = Column(String(1), nullable=False)

    page = Column(Integer, nullable=False)
    row = Column(Integer, nullable=False)
    pageRowStartIndex = Column(Integer, nullable=False)

    paragraph = Column(Integer, nullable=False)
    sentence = Column(Integer, nullable=False)
    paragraphSentenceStartIndex = Column(Integer, nullable=False)

    file_id = Column(Integer, ForeignKey('file.id'))

    def serialize(self):
        return {
            'id': self.id,
            'fileId': self.file_id,
            'text': self.text,
            'startChar': self.startChar,
            'endChar': self.endChar,
            'page': self.page,
            'row': self.row,
            'pageRowStartIndex': self.pageRowStartIndex,
            'paragraph': self.paragraph,
            'sentence': self.sentence,
            'paragraphSentenceStartIndex': self.paragraphSentenceStartIndex,
        }

class File(Base):
    __tablename__ = 'file'
    id = Column(Integer, primary_key=True)
    author = Column(String(255), nullable=False)
    uploadedAt = Column(String(255), nullable=False)
    publishedAt = Column(String(255), nullable=False)
    fileName = Column(String(255), nullable=False)
    words = relationship("Word", backref="file", passive_deletes=True)

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author,
            'uploadedAt': self.uploadedAt,
            'publishedAt': self.publishedAt,
            'fileName': self.fileName,
        }


class Label(Base):
    __tablename__ = 'label'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    labelWords = relationship("LabelWord", backref="label", passive_deletes=True)
    created_at = Column(String(255), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'words': [labelWord.text for labelWord in self.labelWords]
        }


class LabelWord(Base):
    __tablename__ = 'label_word'
    id = Column(Integer, primary_key=True)
    text = Column(String(255), nullable=False)
    label_id = Column(Integer, ForeignKey('label.id', ondelete='CASCADE'))

    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'labelId': self.label_id,
        }


class Expression(Base):
    __tablename__ = 'expression'
    id = Column(Integer, primary_key=True)
    text = Column(String(255), nullable=False)
    created_at = Column(String(255), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'created_at': self.created_at,
        }
