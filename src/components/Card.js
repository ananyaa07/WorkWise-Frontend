import React, { useEffect, useContext } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Draggable } from "react-beautiful-dnd";
import { Button, Popover } from "antd";
import { Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Input, InputNumber } from "antd";
import { Modal, Select, Image } from "antd";
import { useState } from "react";
import { UserContext } from "../utils/contexts/User.js";
// import { Popover, Button } from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";

function Card(props) {
  const params = useParams();
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
    await axios.delete(`${baseUrl}/cards/${card._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
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
    try {
      await axios.post(
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

      setIsModalOpen(false);
      getProjectCards();
    } catch (error) {
      console.error(error);
      // Handle error, show a message, etc.
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

  const content = (
    <>
      <div className="flex flex-col">
        <Button
          className="mb-2"
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
      </div>
    </>
  );

  const handleEllipsisClick = () => {
    console.log("clicked on 3 dots");
    setOpen(!open); // Toggle the `open` state
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
              trigger="contextMenu"
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
                      className="ml-[16.5rem]"
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
