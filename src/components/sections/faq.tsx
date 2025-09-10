"use client";

import React, { useState } from "react";

const FAQSection = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How does Due Gooder work?",
      answer:
        "Due Gooder automatically extracts assignment information from your course syllabi. Simply upload your syllabus, and our AI will identify deadlines, create a structured calendar, and help you stay organized throughout the semester.",
    },
    {
      id: 2,
      question: "Can I sync with Google Calendar?",
      answer:
        "Yes! Due Gooder seamlessly integrates with Google Calendar. Once you've uploaded your syllabi, you can sync all your assignments, due dates, and recommended start dates with just one click.",
    },
    {
      id: 3,
      question: "What's included in the free plan?",
      answer:
        "The free plan includes uploading one syllabus, basic calendar organization, and viewing assignments in a structured timeline. Upgrade to Pro for unlimited syllabi uploads, smart notifications, and AI-powered scheduling suggestions.",
    },
    {
      id: 4,
      question: "How accurate is the AI extraction?",
      answer:
        "Our AI system has been trained on thousands of syllabi and achieves high accuracy in extracting assignment information. You'll always have the chance to review and adjust any details before finalizing your calendar.",
    },
  ];

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  const brandBorders = [
    "border-l-myBlue",
    "border-l-myOrange",
    "border-l-myRed",
    "border-l-myGreen",
  ];
  const brandIcons = [
    "text-myBlue",
    "text-myOrange",
    "text-myRed",
    "text-myGreen",
  ];

  return (
    <section className="mt-16 bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col justify-between lg:col-span-5">
              <div className="lg:max-w-xl">
                <h2 className="font-sans text-3xl font-bold text-gray-900 sm:text-7xl">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-base font-medium text-gray-500">
                  Everything you need to know about using Due Gooder to manage
                  your academic schedule.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flow-root">
                <div className="-my-4">
                  {faqs.map((faq, idx) => (
                    <div
                      key={faq.id}
                      className={`group m-4 rounded-lg bg-gray-100 p-4 transition-all duration-300 hover:-rotate-[1deg] hover:scale-[1.025]`}
                    >
                      <div
                        className={`flex flex-col rounded-xl border-l-8 bg-white transition-all duration-300 ${brandBorders[idx % brandBorders.length]}`}
                      >
                        <h3>
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="flex w-full items-center justify-between space-x-6 px-6 py-4 text-left focus:outline-none"
                          >
                            <span className="flex-1 font-sans text-lg font-bold text-gray-900 sm:text-2xl">
                              {faq.question}
                            </span>
                            <span
                              className={`transform transition-transform duration-200 ${brandIcons[idx % brandIcons.length]}`}
                            >
                              {activeId === faq.id ? (
                                <svg
                                  className="size-6 rotate-180 transform"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="size-6"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        </h3>

                        <div
                          className={`overflow-hidden px-6 transition-all duration-200 ease-in-out ${
                            activeId === faq.id
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="py-4 text-base font-medium text-gray-700 sm:text-lg">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;