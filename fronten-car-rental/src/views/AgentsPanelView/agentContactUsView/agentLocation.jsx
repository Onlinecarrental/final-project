import React from 'react';

const AgentLocation = () => {
  return (
    <section className="text-center font-jakarta px-4 py-10">
      <h2 className="text-3xl font-bold mb-2">Location</h2>
      <p className="text-gray-500">
        This is sample of page tagline and you can set it up using page option
      </p>

      <div className="mt-8 max-w-[900px]  mx-auto rounded-[10px] overflow-hidden shadow-lg">
        <iframe
          title="Lahore Map"
          width="100%"
          height="400"

          loading="lazy"
          allowFullScreen
          src="https://maps.google.com/maps?q=Govt%20Gulberg%20College%20for%20Boys%20Lahore&output=embed"
        ></iframe>
      </div>
    </section>
  );
};

export default AgentLocation;
