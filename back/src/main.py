from datetime import datetime, timedelta
from lxml import etree

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
import random

from mappings import *

engine = create_engine('mysql+pymysql://root:123456@localhost:3307/db')
connection = engine.connect()

app = FastAPI()

session = sessionmaker(bind=engine)()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

paragraph_end_chars = ['.', '!', '?']
punctuation_chars = [',', ';', ':', '(', ')', '[', ']', '-', '.', '!', '?', '"', "'", "{", "}", "/", "\\", "|"]
MAX_ROW_LENGTH = 10
MAX_PAGE_ROWS_AMOUNT = 8
year_month_day_format = '%Y-%m-%d'


@app.get("/expression")
async def get_expressions():
    # get all expressions in DB
    return session.query(Expression).all()


@app.delete("/expression/{id}")
async def delete_expression(id: int):
    session.query(Expression).filter(Expression.id == id).delete()
    session.commit()


@app.post("/expression")
async def create_expression(req: dict):
    expression = Expression(text=req['text'], created_at=datetime.now().strftime(year_month_day_format))
    session.add(expression)
    session.commit()
    return expression


@app.get("/label")
async def get_labels():
    labels = session.query(Label).all()
    return [label.serialize() for label in labels]


@app.delete("/label/{id}")
async def delete_label(id: int):
    session.query(Label).filter(Label.id == id).delete()
    session.commit()


@app.post("/label")
async def create_label(req: dict):
    label = Label(name=req['name'], created_at=datetime.now().strftime(year_month_day_format))
    session.add(label)
    session.commit()
    return label


@app.post("/label/{id}/word")
async def create_label_word(id: int, req: dict):
    label = session.query(Label).filter(Label.id == id).first()
    labelWord = LabelWord(text=req['text'])
    label.labelWords.append(labelWord)
    session.commit()
    return labelWord


@app.delete("/label/{id}/word/{wordText}")
async def delete_label_word(id: int, wordText: str):
    label = session.query(Label).filter(Label.id == id).first()
    label.labelWords = [labelWord for labelWord in label.labelWords if labelWord.text != wordText]
    session.commit()


@app.get("/files")
async def get_files():
    files = session.query(File).all()
    return [file.serialize() for file in files]


@app.get("/file/{id}/content")
async def get_file_content(id: int):
    file = session.query(File).filter(File.id == id).first()
    words_map = {}
    for word in file.words:
        if word.paragraph not in words_map:
            words_map[word.paragraph] = {}
        if word.sentence not in words_map[word.paragraph]:
            words_map[word.paragraph][word.sentence] = []
        words_map[word.paragraph][word.sentence].append(word)

    # sort words by paragraphSentenceStartIndex
    for paragraph in words_map:
        for sentence in words_map[paragraph]:
            words_map[paragraph][sentence].sort(key=lambda word: word.paragraphSentenceStartIndex)
            words_map[paragraph][sentence] = ' '.join(
                [word.startChar + word.text + word.endChar for word in words_map[paragraph][sentence]])

    # return as lists
    return [[words_map[paragraph][row] for row in words_map[paragraph]] for paragraph in words_map]


@app.delete("/file/{id}")
async def delete_file(id: int):
    # delete all words
    session.query(Word).filter(Word.file_id == id).delete()
    # delete file
    session.query(File).filter(File.id == id).delete()
    session.commit()


@app.post("/file")
async def create_file(req: dict):
    file = File(
        author=req['author'],
        uploadedAt=req['uploadedAt'].split('T')[0],
        publishedAt=req['publishedAt'].split('T')[0],
        fileName=req['fileName'],
    )

    content = req['fileContent']
    paragraphs = [x.strip() for x in content.split('\n\n')]

    page = 1
    row = 1
    pageRowStartIndex = 0

    for paragraph_index, paragraph in enumerate(paragraphs):
        sentences = []
        char_index = 0
        while (len(paragraph) > 0 and char_index < len(paragraph)):
            char = paragraph[char_index]
            if char in paragraph_end_chars or char_index == len(paragraph) - 1:
                sentences.append(paragraph[0:char_index + 1])
                paragraph = paragraph[char_index + 1:]
                char_index = 0
            else:
                char_index += 1

        sentences = [x.strip() for x in sentences]

        for sentence_index, sentence in enumerate(sentences):
            words = sentence.split(' ')
            for word_index, word in enumerate(words):
                word = word.strip()
                if len(word) == 0:
                    continue
                startChar = ''
                endChar = ''
                if word[-1] in punctuation_chars:
                    endChar = word[-1]
                    word = word[:-1]

                if len(word) == 0:
                    continue

                if word[0] in punctuation_chars:
                    startChar = word[0]
                    word = word[1:]
                word = Word(
                    text=word,
                    startChar=startChar,
                    endChar=endChar,
                    page=page,
                    row=row,
                    pageRowStartIndex=pageRowStartIndex,
                    paragraph=paragraph_index + 1,
                    sentence=sentence_index + 1,
                    paragraphSentenceStartIndex=word_index,
                    file_id=file.id,
                )
                pageRowStartIndex += 1
                if pageRowStartIndex > MAX_ROW_LENGTH:
                    pageRowStartIndex = 0
                    row += 1
                    if row > MAX_PAGE_ROWS_AMOUNT:
                        row = 1
                        page += 1
                file.words.append(word)

    session.add(file)
    session.commit()


@app.get("/words")
async def get_words(
        word: str = '',
        label: str = '',
        expression: str = '',
        page_based_location: str = '',
        paragraph_based_location: str = '',
        file_name: str = '',
):
    words = []
    if word:
        words = session.query(Word).filter(func.lower(Word.text) == word.lower()).all()

    if label:
        related_label = session.query(Label).filter(func.lower(Label.name) == label.lower()).first()
        if related_label:
            for label_word in related_label.labelWords:
                words += session.query(Word).filter(func.lower(Word.text) == label_word.text.lower()).all()

    if page_based_location:
        page_based_location = page_based_location.split('-')
        words += session.query(Word).filter(
            Word.page == page_based_location[0],
            Word.row == page_based_location[1],
            Word.pageRowStartIndex == page_based_location[2],
        ).all()

    if paragraph_based_location:
        paragraph_based_location = paragraph_based_location.split('-')
        words += session.query(Word).filter(
            Word.paragraph == paragraph_based_location[0],
            Word.sentence == paragraph_based_location[1],
            Word.paragraphSentenceStartIndex == paragraph_based_location[2],
        ).all()

    if expression:
        related_expression = session.query(Expression).filter(func.lower(Expression.text) == expression.lower()).first()
        if related_expression:
            expression_words = related_expression.text.split(' ')
            for expression_word in expression_words:
                for punctuation_char in punctuation_chars:
                    expression_word = expression_word.replace(punctuation_char, '')

            first_word_occurrences = session.query(Word).filter(
                func.lower(Word.text) == expression_words[0].lower()).all()

            expression_references = []
            for word in first_word_occurrences:
                reference = [word]
                for expression_word in expression_words[1:]:
                    if get_next_word(word, session) and get_next_word(word,
                                                                      session).text.lower() == expression_word.lower():
                        word = get_next_word(word, session)
                        reference.append(word)
                    else:
                        break

                if len(reference) == len(expression_words):
                    expression_references.append(reference)

            serialized_words = []
            for reference in expression_references:
                surroundingRows, reach_bottom, reach_top = _get_surrounding_rows(reference[0].file_id,
                                                                                 reference[0].page,
                                                                                 reference[0].row, session)
                serialized_reference = {
                    'id': random.randint(1, 100000000),
                    'fileId': reference[0].file.id,
                    'text': ' '.join([word.text for word in reference]),
                    'startChar': reference[0].startChar,
                    'endChar': reference[-1].endChar,
                    'page': reference[0].page,
                    'row': reference[0].row,
                    'pageRowStartIndex': reference[0].pageRowStartIndex,
                    'paragraph': reference[0].paragraph,
                    'sentence': reference[0].sentence,
                    'paragraphSentenceStartIndex': reference[0].paragraphSentenceStartIndex,
                    "relatedFile": reference[0].file,
                    'surroundingRows': surroundingRows,
                    'reachBottom': reach_bottom,
                    'reachTop': reach_top,

                }
                serialized_words.append(serialized_reference)
            if file_name:
                serialized_words = [word for word in serialized_words if
                                    word['relatedFile'].fileName.lower() == file_name.lower()]
            return serialized_words

    if file_name:
        words = [word for word in words if word.file.fileName.lower() == file_name.lower()]

    if words:
        return_value = []
        for word in words:
            surroundingRows, reach_bottom, reach_top = _get_surrounding_rows(word.file_id, word.page, word.row, session)
            return_value.append({
                **word.serialize(),
                "relatedFile": word.file,
                'surroundingRows': surroundingRows,
                'reachBottom': reach_bottom,
                'reachTop': reach_top,
            })
        return return_value
    else:
        return []


@app.get("/surroundingRows/{fileId}/{pageNumber}/{rowNumber}")
async def get_surrounding_rows(fileId: int, pageNumber: int, rowNumber: int):
    surrounderRows, reach_bottom, reach_top = _get_surrounding_rows(fileId, pageNumber, rowNumber, session)
    return {
        'surroundingRows': surrounderRows,
        'reachBottom': reach_bottom,
        'reachTop': reach_top,
    }


@app.get('/statistics')
async def get_statistics():
    last_ten_days = [{
        'date': (datetime.now() - timedelta(days=i)).strftime(year_month_day_format),
    } for i in range(5)]
    last_ten_days.reverse()

    all_words = session.query(Word).all()
    for day in last_ten_days:
        day['words'] = len([word for word in all_words if word.file.uploadedAt == day['date']])

    all_expressions = session.query(Expression).all()
    for day in last_ten_days:
        day['expressions'] = len([expression for expression in all_expressions if expression.created_at == day['date']])

    all_labels = session.query(Label).all()
    for day in last_ten_days:
        day['labels'] = len([label for label in all_labels if label.created_at == day['date']])

    all_files = session.query(File).all()
    for day in last_ten_days:
        day['files'] = len([file for file in all_files if file.uploadedAt == day['date']])

    all_words = session.query(Word).all()
    words_count = {}
    for word in all_words:
        if word.text in words_count:
            words_count[word.text] += 1
        else:
            words_count[word.text] = 1

    top_five_words = sorted(words_count.items(), key=lambda item: item[1], reverse=True)[:5]
    top_five_words = [{'name': item[0], 'value': item[1]} for item in top_five_words]

    return {
        'amountOverTime': last_ten_days,
        'topFiveWords': top_five_words,
    }


def get_next_word(word: Word, session):
    return session.query(Word).filter(
        Word.file_id == word.file_id,
        Word.paragraph == word.paragraph,
        Word.sentence == word.sentence,
        Word.paragraphSentenceStartIndex == word.paragraphSentenceStartIndex + 1,
    ).first()


def _get_surrounding_rows(file_id, page_number, row_number, session):
    words_in_same_row = get_words_by_row(file_id, page_number, row_number, session)
    total_rows = [words_in_same_row]
    reach_bottom = False
    reach_top = False

    if not get_prev_row_index(page_number, row_number):
        next_row_indexes = get_next_row_index(file_id, page_number, row_number, session)
        if next_row_indexes:
            words_in_next_row = get_words_by_row(file_id, next_row_indexes[0], next_row_indexes[1], session)
            total_rows.append(words_in_next_row)

            next_row_indexes = get_next_row_index(file_id, next_row_indexes[0], next_row_indexes[1], session)
            if next_row_indexes:
                words_in_next_row = get_words_by_row(file_id, next_row_indexes[0], next_row_indexes[1], session)
                total_rows.append(words_in_next_row)
            else:
                reach_top = True
        else:
            reach_top = True

    else:
        next_row_indexes = get_next_row_index(file_id, page_number, row_number, session)
        is_last_row_in_file = not next_row_indexes
        if is_last_row_in_file:
            reach_top = True
            previous_row_indexes = get_prev_row_index(page_number, row_number)
            words_in_previous_row = get_words_by_row(file_id, previous_row_indexes[0], previous_row_indexes[1], session)
            total_rows.insert(0, words_in_previous_row)

            previous_row_indexes = get_prev_row_index(previous_row_indexes[0], previous_row_indexes[1])
            if previous_row_indexes:
                words_in_previous_row = get_words_by_row(file_id, previous_row_indexes[0], previous_row_indexes[1],
                                                         session)
                total_rows.insert(0, words_in_previous_row)
            else:
                reach_bottom = True
        else:
            words_in_next_row = get_words_by_row(file_id, next_row_indexes[0], next_row_indexes[1], session)
            total_rows.append(words_in_next_row)

            previous_row_indexes = get_prev_row_index(page_number, row_number)
            words_in_previous_row = get_words_by_row(file_id, previous_row_indexes[0], previous_row_indexes[1], session)
            total_rows.insert(0, words_in_previous_row)

            if not get_prev_row_index(previous_row_indexes[0], previous_row_indexes[1]):
                reach_bottom = True

            next_row_indexes = get_next_row_index(file_id, next_row_indexes[0], next_row_indexes[1], session)
            if not next_row_indexes:
                reach_top = True

    return [{
        'page': row[0].page,
        'row': row[0].row,
        'text': ' '.join([word.startChar + word.text + word.endChar for word in row]),
    } for row in total_rows], reach_bottom, reach_top


def get_words_by_row(file_id, page_id, row_id, session):
    return session.query(Word).filter(
        Word.file_id == file_id,
        Word.page == page_id,
        Word.row == row_id,
    ).all()


def get_next_row_index(file_id, page, row, session):
    next_row_words = session.query(Word).filter(
        Word.file_id == file_id,
        Word.page == page,
        Word.row == row + 1,
    ).all()
    if next_row_words:
        return page, row + 1
    else:
        next_row_words = session.query(Word).filter(
            Word.file_id == file_id,
            Word.page == page + 1,
            Word.row == 1,
        ).all()
        if next_row_words:
            return page + 1, 1
        else:
            return None


def get_prev_row_index(page, row):
    if row != 1:
        return page, row - 1
    elif page != 1:
        return page - 1, MAX_PAGE_ROWS_AMOUNT
    else:
        return None


@app.get('/export_xml')
def export_to_xml():
    root = etree.Element('root')

    all_expressions = session.query(Expression).all()
    serialized_all_expressions = [expression.serialize() for expression in all_expressions]
    for expression in serialized_all_expressions:
        expression_element = etree.SubElement(root, 'expression')
        for k, v in expression.items():
            expression_element.set(k, str(v))

    all_labels = session.query(Label).all()
    serialized_all_labels = [label.serialize() for label in all_labels]
    for label in serialized_all_labels:
        label_element = etree.SubElement(root, 'label')
        label.pop('words')
        for k, v in label.items():
            label_element.set(k, str(v))

    all_label_words = session.query(LabelWord).all()
    serialized_all_label_words = [label_word.serialize() for label_word in all_label_words]
    for label_word in serialized_all_label_words:
        label_word_element = etree.SubElement(root, 'label_word')
        for k, v in label_word.items():
            label_word_element.set(k, str(v))

    all_words = session.query(Word).all()
    serialized_all_words = [word.serialize() for word in all_words]
    for word in serialized_all_words:
        word_element = etree.SubElement(root, 'word')
        for k, v in word.items():
            word_element.set(k, str(v))

    all_fils = session.query(File).all()
    serialized_all_files = [file.serialize() for file in all_fils]
    for file in serialized_all_files:
        file_element = etree.SubElement(root, 'file')
        for k, v in file.items():
            file_element.set(k, str(v))

    return etree.tostring(root, pretty_print=True, encoding='utf-8', xml_declaration=True).decode('utf-8')


@app.post('/import_xml')
def import_from_xml(req: dict):
    text = req['text']
    # parse xml
    encoded = text.encode('utf-8')
    root = etree.fromstring(encoded)
    all_expressions = root.findall('expression')
    for expression in all_expressions:
        expression_dict = expression.attrib
        expression_obj = Expression(**expression_dict)
        session.merge(expression_obj)
        session.commit()


    all_labels = root.findall('label')
    for label in all_labels:
        label_dict = label.attrib
        label_obj = Label(**label_dict)
        session.merge(label_obj)
        session.commit()

    all_label_words = root.findall('label_word')
    for label_word in all_label_words:
        label_word_dict = label_word.attrib
        label_word_obj = LabelWord(
            id=label_word_dict['id'],
            text=label_word_dict['text'],
            label_id=label_word_dict['labelId'],
        )
        session.merge(label_word_obj)
        session.commit()

    all_words = root.findall('word')
    for word in all_words:
        word_dict = word.attrib
        word_dict['file_id'] = word_dict.pop('fileId')
        word_obj = Word(**word_dict)
        session.merge(word_obj)
        session.commit()

    all_files = root.findall('file')
    for file in all_files:
        file_dict = file.attrib
        file_obj = File(**file_dict)
        session.merge(file_obj)
        session.commit()
