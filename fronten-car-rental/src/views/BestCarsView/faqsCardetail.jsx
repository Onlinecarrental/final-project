import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import HeadingTitle from '../../components/heading';

export default function FAQDetailCars() {
  const faqs = [
    {
      question: "What is the difference between a UI and UX Designer?",
      answer: "A UI (User Interface) Designer focuses on the visual elements of a product such as buttons, icons, spacing, typography, and color schemes. They create the look and feel of an interface. A UX (User Experience) Designer focuses on the overall feel and functionality of the product, how users interact with it, and ensuring it meets user needs through research, testing, and iteration."
    },
    {
      question: "How to become a UI designer?",
      answer: "To become a UI designer: 1) Learn design fundamentals including color theory, typography, and layout. 2) Master design tools like Figma, Adobe XD, or Sketch. 3) Study UI principles and patterns. 4) Build a portfolio of projects. 5) Practice by redesigning existing interfaces. 6) Get feedback from professional designers. 7) Network in the design community and apply for entry-level positions or internships."
    },
    {
      question: "What is the difference between a UI and UX Designer?",
      answer: "UI Designers create the visual elements users interact with, focusing on aesthetics and presentation. UX Designers focus on the entire user journey and experience, conducting research to understand user needs and behaviors. While UI is about how things look, UX is about how things work and feel from the user's perspective."
    },
    {
      question: "How to become a UI designer?",
      answer: "The path to becoming a UI designer includes: learning visual design principles, developing proficiency with industry-standard tools, understanding accessibility standards, creating a strong portfolio, gaining practical experience through projects or internships, staying updated with design trends, and potentially pursuing relevant education or certification programs."
    },
    {
      question: "How to become a UI designer?",
      answer: "To become a UI designer, start by learning the fundamentals of visual design, developing technical skills with design software, building a portfolio showcasing your work, networking with other designers, seeking mentorship, participating in design challenges, and applying for junior positions to gain professional experience."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1250px] mx-auto p-6 bg-white">
     <HeadingTitle title="Frequently asked questions"
     paragraph='To make working easy and hassle-free, we provide a variety of services and advantages. We have you covered with a variety of services and flexible rental terms.'/>

      <div className="space-y-3 max-w-[920px] mt-12 mx-auto">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-gray rounded cursor-pointer"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown 
                className={`transform text-Blue transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            {activeIndex === index && (
              <div className="p-4 pt-2  bg-black  text-white">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}