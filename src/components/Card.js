import React, { useEffect, useContext } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Draggable } from "react-beautiful-dnd";
import { Button, Popover, Select } from "antd";
import { Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Input, InputNumber } from "antd";
import { message, Modal, Image } from "antd";
import { useState } from "react";
import { UserContext } from "../utils/contexts/User.js";
// import { Popover, Button } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";

function Card(props) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting]= useState(false);
  const [isAssigning, setIsAssigning]=useState(false);
  const { baseUrl } = useContext(UserContext);
  // const [openIssue, setOpenIssue]=useState(true);
  const [ContentVisible, setContentVisible] = useState(false);
  const card = props.card;
  const dateFormat = "DD/MM/YYYY";
  const text = <span>Actions</span>;
  let cardsData = [[], [], [], []];
  const Columns = ["backlog", "todo", "in-progress", "review"];
  const [imgUrl, setImgUrl] = useState(card?.imageUrl);
  const [priority, setPriority] = useState(card?.priority);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);
  const [comment, setComment] = useState("");
  const [assigneeInput, setAssigneeInput] = useState("");
  const [assigneeModalVisible, setAssigneeModalVisible] = useState(false);

  function getNames(objArray) {
    const names = [];

    for (let i = 0; i < objArray.length; i++) {
      const obj = objArray[i];
      const name = obj.name;

      names.push(name);
    }

    return names;
  }

  const [tags, setTags] = useState(getNames(card?.tags));

  useEffect(() => {
    if (isModalOpen) {
      console.log(tags);
    }
  }, [isModalOpen]);

  const getProjectCards = async () => {
    for (let i = 0; i < Columns.length; i++) {
      const res = await axios.get(
        `${baseUrl}/projects/${params.section}/cards/${Columns[i]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      cardsData[i] = res.data.cards;
    }
    props.setElements(cardsData);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    let res= await axios.delete(`${baseUrl}/cards/${card._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    if (res.status === 200) {
      message.success(`Issue deleted successfully`);
    } else {
      message.error("Failed to delete issue");
    }
    setIsDeleting(false);
    getProjectCards();
  };

  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleTagChange = (newTags) => {
    setTags(newTags);
  };

  const onChange = (value) => {
    setPriority(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async (values) => {
    setIsLoading(true);
    try {
      let res=await axios.post(
        `${baseUrl}/cards/${card._id}/comment`,
        {
          message: values.title,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (res.status === 200) {
        message.success(`Comment added successfully`);
      } else {
        message.error("Failed to add comment");
      }
      setIsLoading(false);
      setIsModalOpen(false);
      getProjectCards();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    await axios.put(
      `${baseUrl}/cards/${card._id}`,
      {
        title: values.title,
        description: values.description,
        tags: tags,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      }
    );
    setIsModalOpen(false);
    getProjectCards();
  };

  const showAssigneeModal = () => {
    setAssigneeModalVisible(true);
  };

  const handleAssigneeOk = async (values) => {
    setIsAssigning(true);
    try {
      const assigneesArray = values.assignees.map((assignee) =>
        assignee.trim()
      );

      let response= await axios.post(
        `${baseUrl}/cards/${card._id}/assign`,
        {
          id: card._id,
          assignees: assigneesArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.status === 200) {
        message.success(`Issue assigned successfully`);
      } else {
        message.error("Failed to assign issue");
      }
      setIsAssigning(false);
      setAssigneeModalVisible(false);
      getProjectCards();
    } catch (error) {
      setIsAssigning(false);
      console.error(error);
    }
  };

  const handleAssigneeCancel = () => {
    setAssigneeModalVisible(false);
  };

  const content = (
    <>
      <div className="flex flex-col">
        <Button
          className="mb-2"
          loading={isDeleting}
          onClick={() => {
            handleDelete();
          }}
        >
          Delete
        </Button>
        <Button
          className="mb-2"
          
          onClick={() => {
            setOpen(false);
            showModal();
          }}
        >
          Put Comment
        </Button>
        {props.collaborators.length != 0 ? (
          <Button
            className="mb-2"
            onClick={() => {
              setOpen(false);
              showAssigneeModal();
            }}
          >
            Assign Task
          </Button>
        ) : (
          <> </>
        )}
      </div>
    </>
  );

  const handleEllipsisClick = () => {
    console.log("clicked on 3 dots");
    setOpen(!open);
  };

  const onRadioChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <Draggable draggableId={card._id} index={props.index}>
      {(provided, snapshot) => {
        return (
          <>
            <Popover
              placement="right"
              title={text}
              content={content}
              open={open}
              onOpenChange={handleOpenChange}
              trigger="click"
            >
              <div className="relative">
                <div
                  onClick={handleEllipsisClick}
                  className="hover:bg-transparent"
                >
                  <Button
                    type="text"
                    icon={<EllipsisOutlined className="hover:bg-transparent" />}
                    className="absolute top-4 right-5 cursor-pointer"
                    visible={open} // Use the `open` state to control visibility
                    onVisibleChange={handleEllipsisClick} // Use the new function
                    trigger="click"
                  />
                </div>

                <div
                  ref={provided.innerRef}
                  snapshot={snapshot}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="w-[88%] m-4 h-max bg-[#FFFFFF] rounded-lg overflow-hidden"
                >
                  <div className="tags flex justify-start ml-4 mr-4 mt-4 mb-2 overflow-x-scroll">
                    {props.card.tags.map((item, index) => {
                      return (
                        <Tag
                          key={index}
                          bordered={false}
                          className={`inline-block rounded px-3 py-1 text-sm font-semibold text-black mr-2 mb-2`}
                          color={item.color}
                        >
                          {item.name}
                        </Tag>
                      );
                    })}
                  </div>
                  {console.log(card)}
                  {card?.imageUrl && (
                    <div className="px-5 pt-4 mt-4">
                      <div className="font-medium font-body text-base mb-1">
                        {card?.title}
                      </div>
                      <p className="text-gray-500 font-body text-base">
                        {card?.description}
                      </p>
                    </div>
                  )}
                  {!card?.imageUrl && (
                    <div className="px-5">
                      <div className="font-medium font-body text-base mb-1">
                        {card?.title}
                      </div>
                      <p className="font-body text-gray-500 text-base">
                        {card?.description}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between px-5 pt-3">
                    {card?.assignedUsers.length !== 0 && (
                      <div className="flex items-center">
                        {card.assignedUsers.map((assignee) => (
                          <Image
                            key={assignee.username}
                            width={20}
                            src={assignee.picture}
                            alt={assignee.picture}
                            preview={false}
                            className="mr-2 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                    {card?.startDate && (
                      <div className="rounded w-32 py-1 text-sm font-medium font-body text-gray-900 mb-2">
                        <DatePicker
                          defaultValue={dayjs(card?.startDate, dateFormat)}
                          format={dateFormat}
                        />
                      </div>
                    )}
                    {!card?.startDate && (
                      <div class="rounded w-32 py-1 text-sm font-medium font-body text-gray-900 mb-2">
                        <DatePicker
                          defaultValue={dayjs()}
                          format={dateFormat}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popover>
            {
              <Modal
                destroyOnClose={true}
                title="Issue Modal"
                visible={isModalOpen}
                footer={null}
                onCancel={handleCancel}
              >
                <Form
                  name="basic"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={handleOk}
                  autoComplete="off"
                  className="my-8"
                >
                  <Form.Item label="Comment" name="title">
                    <Input placeholder="Enter comments" />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button
                      key="ok"
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      className="ml-[16.5rem]"
                    >
                      OK
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            }

            {
              /* Assignee Modal */
              <Modal
                destroyOnClose={true}
                title="Assignee Modal"
                visible={assigneeModalVisible}
                footer={null}
                onCancel={handleAssigneeCancel}
              >
                <Form
                  name="assigneeForm"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={handleAssigneeOk}
                  autoComplete="off"
                  className="my-8"
                >
                  <Form.Item
                    label="Assignees"
                    name="assignees"
                    rules={[
                      { required: true, message: "Please select assignees!" },
                    ]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Select assignees"
                    >
                      {props.collaborators.map((collaborator) => (
                        <Select.Option
                          key={collaborator.id}
                          value={collaborator.username}
                        >
                          {collaborator.username}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button
                      key="assigneeOk"
                      type="primary"
                      htmlType="submit"
                      className="ml-[16.5rem]"
                      loading={isAssigning}
                    >
                      OK
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            }
          </>
        );
      }}
    </Draggable>
  );
}

export default Card;
