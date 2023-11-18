import React, { useEffect } from "react";
import { Tag, Image, Divider } from "antd";
import { Link } from "react-router-dom";

export default function Details({ card, setPrModalOpen }) {
  useEffect(() => {
    console.log(card);
  }, [card]);

  return (
    <>
      <div
        className="relative"
        onDoubleClick={() => {
          setPrModalOpen(true);
        }}
      >
        <div className="tags flex justify-start ml-4 mr-4 mt-4 mb-2 overflow-x-scroll">
          {card.tags.map((item, index) => {
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
            <div className="font-medium font-body text-xl mb-1">
              {card?.title}
            </div>
            <p className="text-gray-500 font-body text-base">
              {card?.description}
            </p>
          </div>
        )}

        {!card?.imageUrl && (
          <div className="px-5">
            <div className="font-bold font-body text-2xl mb-1 cursor-pointer">
              <a
                href={`https://github.com/${card?.projectId.owner.username}/${card?.projectId.name}/issues/${card?.issueNumber}`}
              >
                {card?.title}
              </a>
            </div>
            <p className="font-body text-gray-500 text-base">
              {card?.description}
            </p>
          </div>
        )}
      </div>

      <div className="container mt-2 mb-4 flex flex-col items-center justify-center w-full mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="w-full px-4 py-5 border-b sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Assigned Users
          </h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500 dark:text-gray-200">
            Details of the users who have been assigned this issue.
          </p>
        </div>
        <ul className="flex flex-col divide-y divide w-full pl-4 pr-4">
          {card?.issuedTo.length !== 0 && (
            <>
              {card.issuedTo.map((assignee) => (
                <li className="flex flex-row">
                  <a
                    href={`https://github.com/${assignee.username}`}
                    target="_blank"
                    className="flex items-center flex-1 p-4 cursor-pointer select-none"
                  >
                    <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
                      <img
                        alt="profil"
                        src={assignee.avatar_url}
                        className="mx-auto object-cover rounded-full h-10 w-10 "
                      />
                    </div>
                    <div className="flex-1 pl-1 mr-16">
                      <div className="font-medium dark:text-white">
                        {assignee.username}
                      </div>
                    </div>

                    {/* <button className="flex justify-end w-24 text-right">
											<svg
												width="20"
												fill="currentColor"
												height="20"
												className="text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-200"
												viewBox="0 0 1792 1792"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
											</svg>
										</button> */}
                  </a>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      <Divider />

      {card?.pull_requests.length !== 0 && (
        <>
          <div className="container mt-8 mb-4 flex flex-col items-center justify-center w-full mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="w-full px-4 py-5 border-b sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                PRs Received
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500 dark:text-gray-200">
                Details of the PRs received for this issue.
              </p>
            </div>
            <ul className="flex flex-col divide-y divide w-full pl-4 pr-4">
              {card.pull_requests.map((pr) => (
                <li className="flex flex-row">
                  <a
                    href={`${pr.url}`}
                    target="_blank"
                    className="flex items-center flex-1 p-4 cursor-pointer select-none"
                  >
                    <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
                      <img
                        alt="profil"
                        src={pr.author.avatar_url}
                        className="mx-auto object-cover rounded-full h-10 w-10 "
                      />
                    </div>
                    <div className="flex-1 pl-1 mr-16">
                      <div className="font-medium dark:text-white">
                        {pr.author.username}
                      </div>
                      <div class="text-xs text-gray-600 dark:text-gray-200">
                        {pr.title}
                      </div>
                    </div>
                    <div class="flex flex-shrink-0 ml-2">
                      <p
                        class={`inline-flex px-2 text-xs font-semibold leading-5 ${
                          pr.status === "closed"
                            ? "text-red-800 bg-red-100"
                            : pr.status === "merged"
                            ? "text-green-800 bg-green-100"
                            : "text-yellow-800 bg-yellow-100"
                        } rounded-full`}
                      >
                        {pr.status}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {card?.pull_requests.length === 0 && (
        <>
          <div className="container mt-8 mb-4 flex flex-col items-center justify-center w-full mx-auto bg-red-100 rounded-lg shadow dark:bg-gray-800">
            <div className="w-full px-4 py-5 border-b sm:px-6">
              <p className="max-w-2xl text-center mt-1 text-sm text-red-500 dark:text-gray-200">
                No PRs received for this issue yet.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
