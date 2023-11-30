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
import Details from "./Details.js";

function Card(props) {
  const [state, setState] = useState("open"); // Default state is open
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  //   useEffect(() => {
  //     console.log(props.card);
  //   }, [props.card]);

  const showUpdateModal = async () => {
    setUpdateModalVisible(true);
    console.log(card);
    form.setFieldsValue({
      title: card.title,
      description: card.description,
      tags: [...card.tags.map((tag) => tag.name)],
      assignees: [...card.issuedTo.map((assignee) => assignee.username)],
    });
  };

  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const { baseUrl } = useContext(UserContext);
  // const [openIssue, setOpenIssue]=useState(true);
  const [ContentVisible, setContentVisible] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
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
      // console.log(card);
      // console.log(tags);
    }
  }, [isModalOpen]);

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < dayjs().startOf("day");
  };

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
      // console.log(res.data);
      cardsData[i] = res.data.cards;
    }
    props.setElements(cardsData);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    let res = await axios.delete(`${baseUrl}/cards/${card._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    if (res.status === 200) {
      message.success(`Issue deleted successfully`);
      setUpdateModalVisible(false);
    } else {
      message.error("Failed to delete issue");
    }
    setIsUpdating(false);
    getProjectCards();
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
      let res = await axios.post(
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
      setUpdateModalVisible(false);
      getProjectCards();
    } catch (error) {
      setUpdateModalVisible(false);
      setIsLoading(false);
      console.error(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
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

      let response = await axios.post(
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
          onClick={() => {
            setOpen(false);
            showUpdateModal();
          }}
        >
          Update
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
        {props.collaborators.length !== 0 ? (
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

  const onFinish = async (values) => {
    const { title, description, tags, state } = values;
    setIsUpdating(true);
    if (state == "deleted") {
      handleDelete();
      return;
    }
    const newTags = tags.map((tag) => {
      return { name: tag };
    });

    console.log(newTags);

    try {
      const response = await axios.patch(
        `${baseUrl}/cards/${card._id}`,
        {
          title,
          category: card.category,
          description,
          tags: newTags,
          state,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setIsUpdating(false);
      setUpdateModalVisible(false);
      message.success(`Issue updated successfully`);
    } catch (error) {
      console.error(error);
      message.error("Failed to update issue");
      setIsUpdating(false);
    }

    getProjectCards();
  };

  const handleEllipsisClick = () => {
    setOpen(!open);
  };

  function convertDate(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    const jsDate = new Date(year, month - 1, day);
    const originalDate = jsDate.toISOString();

    return originalDate;
  }

  const handleDateChange = async (date, dateString) => {
    const deadline = convertDate(dateString);

    try {
      let response = await axios.patch(
        `${baseUrl}/cards/${card._id}/deadline`,
        {
          deadline: deadline,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (response.status === 200) {
        message.success(`Deadline set successfully`);
      } else {
        message.error("Failed to set deadline");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Draggable draggableId={card._id} index={props.index}>
      {(provided, snapshot) => {
        return (
          <>
            <Modal
              visible={prModalOpen}
              width={"40%"}
              footer={null}
              onCancel={() => setPrModalOpen(!prModalOpen)}
              closeIcon={<></>}
            >
              <Details card={card} setPrModalOpen={setPrModalOpen} />
            </Modal>
            {updateModalVisible && (
              <Modal
                destroyOnClose={true}
                title="Update Your Issue"
                visible={updateModalVisible}
                footer={null}
                onCancel={() => setUpdateModalVisible(false)}
              >
                <Form
                  form={form}
                  name="updateDetailsForm"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  autoComplete="off"
                  className="my-8"
                >
                  <Form.Item
                    label="Issue Title"
                    name="title"
                    rules={[
                      { required: true, message: "Please input the title!" },
                    ]}
                  >
                    <Input placeholder="Title" />
                  </Form.Item>

                  <Form.Item label="Issue Description" name="description">
                    <Input.TextArea placeholder="Description" />
                  </Form.Item>

                  <Form.Item label="Tags" name="tags">
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Tags"
                    ></Select>
                  </Form.Item>

                  <Form.Item
                    label="Update Status"
                    name="state"
                    initialValue="open"
                  >
                    <Select
                      onChange={(value) => {
                        setState(value);
                      }}
                    >
                      <Select.Option value="open">Open</Select.Option>
                      <Select.Option value="closed">
                        Close as completed
                      </Select.Option>
                      <Select.Option value="deleted">Delete</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item className=" flex justify-end px-10">
                    <Button htmlType="submit" className="" loading={isUpdating}>
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            )}
            <Popover
              placement="right"
              title={text}
              content={content}
              open={open}
              onOpenChange={handleOpenChange}
              trigger="contextMenu"
            >
              <div className="relative">
                <div className="hover:bg-transparent">
                  <Button
                    type="text"
                    icon={<EllipsisOutlined className="hover:bg-transparent" />}
                    className="absolute top-4 right-5 cursor-pointer"
                    visible={open}
                    onClick={handleEllipsisClick}
                  />
                </div>

                <div
                  ref={provided.innerRef}
                  snapshot={snapshot}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="w-[88%] m-4 h-max bg-[#FFFFFF] rounded-lg overflow-hidden"
                  onDoubleClick={() => setPrModalOpen(true)}
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
                  {/* {console.log(
                    `https://github.com/${card?.projectId.owner.username}/${card?.projectId.name}/issues/${card?.issueNumber}`
                  )} */}
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
                      <div className="font-medium font-body text-base mb-1 cursor-pointer">
                        <a
                          href={`https://github.com/${card?.projectId.owner.username}/${card?.projectId.name}/issues/${card?.issueNumber}`}
                          className="hover:underline"
                        >
                          {card?.title}
                        </a>
                      </div>
                      <p className="font-body text-gray-500 text-base">
                        {card?.description}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between px-5 pt-3">
                    {card?.issuedTo.length !== 0 && (
                      <div className="flex items-center">
                        {card?.issuedTo.length !== 0 && (
                          <div className="flex items-center">
                            {card.issuedTo.map((assignee) => (
                              <Image
                                key={assignee.username}
                                width={20}
                                src={assignee.avatar_url}
                                alt={assignee.avatar_url}
                                preview={false}
                                className="mr-2 rounded-full"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="rounded w-32 py-1 text-sm font-medium font-body text-gray-900 mb-2">
                      <DatePicker
                        format={dateFormat}
                        defaultValue={
                          card.deadline ? dayjs(card?.deadline) : null
                        }
                        onChange={handleDateChange}
                        disabledDate={disabledDate}
                      />
                    </div>
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
                      defaultValue={card.issuedTo.map(
                        (assignee) => assignee.username
                      )}
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
