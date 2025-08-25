import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import HeadingTitle from '../../components/heading';

export default function FAQDetailCars() {
  const faqs = [
    {
      question: "What is the best option if I need a budget-friendly car for daily use?",
      answer: "Economy cars are the best choice for daily travel. They are fuel-efficient, easy to drive in the city, and available at the lowest rental rates."
    },
    {
      question: "Which car category is suitable for long-distance family trips?",
      answer: "SUVs are highly recommended for family trips. They have more space, strong performance, and better comfort for long journeys with luggage."
    },
    {
      question: "I am traveling for a business meeting. Which car category should I book?",
      answer: "A Sedan or Luxury car is perfect for business travel. Sedans provide comfort and reliability, while Luxury cars give a premium and professional impression."
    },
    {
      question: "Do you have vehicles for larger groups like friends or office tours?",
      answer: " Yes, Vans and MPVs are available for larger groups. They have multiple seating options, making them ideal for office tours, picnics, or airport transfers."
    },
    {
      question: "What is the long-term vision of this project?",
      answer: "Our vision is to become the most trusted car rental platform in the region, offering modern technology, wider car options, and a seamless user experience."
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