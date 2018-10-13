from hypothesis import given
from hypothesis.strategies import text, one_of, none, integers, lists
from hypothesis.strategies import dates
from pytest import raises

from kanban.domain.model.workitem import register_new_work_item


@given(name=text(min_size=1),
       due_date=one_of(dates(), none()),
       content=text())
def test_register_new_work_item_creates_a_work_item(name, due_date, content):
    work_item = register_new_work_item(name, due_date, content)
    assert work_item.name == name
    assert work_item.due_date == due_date
    assert work_item.content == content


@given(due_date=one_of(dates(), none()),
       content=text())
def test_register_new_work_item_with_invalid_name_raises_value_error(due_date, content):
    with raises(ValueError):
        register_new_work_item("", due_date, content)


@given(initial_name=text(min_size=1),
       changed_name=text(min_size=1),
       due_date=one_of(dates(), none()),
       content=text())
def test_name_setter_changes_name(initial_name, changed_name, due_date, content):
    work_item = register_new_work_item(initial_name, due_date, content)
    work_item.name = changed_name
    assert work_item.name == changed_name
    assert work_item.due_date == due_date
    assert work_item.content == content


@given(initial_name=text(min_size=1),
       changed_names=lists(text(min_size=1), max_size=100),
       due_date=one_of(dates(), none()),
       content=text())
def test_name_setter_increments_version(initial_name, changed_names, due_date, content):
    work_item = register_new_work_item(initial_name, due_date, content)
    initial_version = work_item.version
    for changed_name in changed_names:
        work_item.name = changed_name
    final_version = work_item.version
    assert final_version == initial_version + len(changed_names)


@given(initial_name=text(min_size=1),
       due_date=one_of(dates(), none()),
       content=text())
def test_name_setter_with_invalid_name_raises_value_error(initial_name, due_date, content):
    work_item = register_new_work_item(initial_name, due_date, content)
    with raises(ValueError):
        work_item.name = ''


@given(name=text(min_size=1),
       initial_due_date=one_of(dates(), none()),
       changed_due_date=one_of(dates(), none()),
       content=text())
def test_due_date_setter_changes_due_date(name, initial_due_date, changed_due_date, content):
    work_item = register_new_work_item(name, initial_due_date, content)
    work_item.due_date = changed_due_date
    assert work_item.name == name
    assert work_item.due_date == changed_due_date
    assert work_item.content == content


@given(name=text(min_size=1),
       initial_due_date=one_of(dates(), none()),
       changed_due_dates=lists(one_of(dates(), none()), max_size=100),
       content=text())
def test_date_setter_increments_version(name, initial_due_date, changed_due_dates, content):
    work_item = register_new_work_item(name, initial_due_date, content)
    initial_version = work_item.version
    for changed_due_date in changed_due_dates:
        work_item.due_date = changed_due_date
    final_version = work_item.version
    assert final_version == initial_version + len(changed_due_dates)


@given(name=text(min_size=1),
       due_date=one_of(dates(), none()),
       initial_content=text(),
       changed_content=text())
def test_content_setter_changes_content(name, due_date, initial_content, changed_content):
    work_item = register_new_work_item(name, due_date, initial_content)
    work_item.content = changed_content
    assert work_item.name == name
    assert work_item.due_date == due_date
    assert work_item.content == changed_content


@given(name=text(min_size=1),
       due_date=one_of(dates(), none()),
       initial_content=text(),
       changed_contents=lists(text(), max_size=100))
def test_content_setter_increments_version(name, due_date, initial_content, changed_contents):
    work_item = register_new_work_item(name, due_date, initial_content)
    initial_version = work_item.version
    for changed_content in changed_contents:
        work_item.content = changed_content
    final_version = work_item.version
    assert final_version == initial_version + len(changed_contents)
