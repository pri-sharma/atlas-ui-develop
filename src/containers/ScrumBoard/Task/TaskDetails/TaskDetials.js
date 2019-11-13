import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Badge, Row, Col, Tooltip } from 'antd';
import moment from 'moment';
import Comments from '../../../../components/ScrumBoard/Comments/Comments';
import CardDetailsHeader from './TaskDetailsHeader';
import HeadingWithIcon from '../../../../components/ScrumBoard/HeadingWithIcon/HeadingWithIcon';
import {
  CardDetailsWrapper,
  AttachmentWrapper,
  TaskName,
  TaskDescription,
  ClockIcon,
} from '../Task.style';
import { IconSvg } from '../../../../components/ScrumBoard/IconSvg/IconSvg';
import PlusIcon from '../../../../static/Images/24.svg';
import TitleIcon from '../../../../static/Images/05-icon.svg';
import DescriptionIcon from '../../../../static/Images/06-icon.svg';
import AttachmentIcon from '../../../../static/Images/01-icon.svg';
import Clock from '../../../../static/Images/17.svg';
import scrumBoardActions from '../../../../redux/scrumBoard/actions';

const TaskDetials = ({
  task,
  deleteTask,
  editTask,
  closeDrawer,
  openDrawer,
  columnId,
}) => {
  return (
    <CardDetailsWrapper>
      <CardDetailsHeader
        onBtnClick={() => {
          editTask(task);
          openDrawer({
            drawerType: 'CREATE_OR_EDIT_TASK',
            drawerProps: {
              initials: { ...task, editing: true },
              columnId: columnId,
            },
          });
        }}
        onIconClick={closeDrawer}
        onDelete={() => {
          deleteTask({
            taskId: task.id,
            column_id: columnId,
          });
          closeDrawer();
        }}
      />
      <HeadingWithIcon heading="Task Name" iconSrc={TitleIcon} />
      <TaskName>{task.title}</TaskName>
      <Row gutter={16}>
        <Col md={8}>
          <HeadingWithIcon heading="Assigned Members" />
          <p>
            {task.assignees.map(assignee => (
              <Fragment key={assignee}>
                {!assignee ? (
                  <IconSvg src={PlusIcon} />
                ) : (
                  <IconSvg
                    src={
                      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                    }
                    padding={'0'}
                    radius={'10% 30% 25%'}
                  />
                )}
              </Fragment>
            ))}
          </p>
        </Col>
        <Col md={8}>
          <HeadingWithIcon heading="Labels" />
          <p>
            {task.labels.map(label => (
              <Tooltip
                title={`${label[0].toUpperCase()}${label.slice(1)}`}
                placement="bottom"
                key={label}
              >
                <Badge status={label} />
              </Tooltip>
            ))}
          </p>
        </Col>
        <Col md={8}>
          <HeadingWithIcon heading="Due Date" />
          <ClockIcon src={Clock} />
          {moment(task.due_date).format('ddd d, YYYY')}
        </Col>
      </Row>

      <HeadingWithIcon heading="Description" iconSrc={DescriptionIcon} />
      <TaskDescription>{task.description}</TaskDescription>
      <AttachmentWrapper>
        <HeadingWithIcon heading="Attachments" iconSrc={AttachmentIcon} />
      </AttachmentWrapper>
      <Comments />
    </CardDetailsWrapper>
  );
};
export default connect(
  null,
  { ...scrumBoardActions }
)(TaskDetials);
