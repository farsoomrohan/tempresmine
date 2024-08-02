import React, { useState } from "react";
import NavBar from "../components/NavBar";
import img from "../images/home.png";
import AuthModals from "../utils/AuthModals";

function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col-reverse lg:flex-row items-center mx-4 lg:mx-20 mt-4 lg:mt-0 py-8 lg:py-16 space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="flex-1 flex flex-col items-start space-y-6 lg:items-start mb-10">
          <h1 className="text-3xl font-bold text-textHeading lg:text-4xl lg:leading-tight ">
            Job Recruitment
          </h1>
          <p className="text-xl leading-normal text-gray-700 lg:text-2xl ">
            Our fast resume miner will help you find the perfect candidate in a
            few seconds!
          </p>
          <button
            onClick={toggleModal}
            className="px-7 py-3 text-lg font-medium text-center text-white bg-btnColor rounded-lg hover:bg-btnHover"
          >
            Login!
          </button>
          <div className="space-y-3 pt-7">
            <ul className="flex flex-row gap-12 font-bold text-lg text-[#0E3374] list-disc list-inside mt-4 lg:text-xl">
              <li>Skill Matching</li>
              <li>Candidate Sourcing</li>
              <li>Extraction</li>
            </ul>
            <ul className="flex flex-row gap-12 font-bold list-disc list-inside mt-4 text-lg lg:text-xl text-[#0E3374] ">
              <li>Keyword matching</li>
              <li>Additional Considerations</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={img}
            alt="Hero Illustration"
            className="w-full h-auto max-w-md lg:max-w-xl object-cover"
            loading="eager"
          />
        </div>
      </div>
      {isOpen && <AuthModals isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
}

export default LandingPage;

// Do not clear this

// <>
//   <NavBar />

//   <div className="flex flex-wrap mx-20 mt-4 2xl:mt-0 lg:mt-0 xl:mt-0 lg:mx-20 xl:mx-20 2xl:mx-20 md:mx-20 ">
//     <div className="flex items-center pb-10 w-full lg:w-1/2">
//       <div className="max-w-2xl mb-8 ml-8">
//         <h1 className="text-3xl font-bold text-textHeading lg:text-3xl lg:leading-tight xl:text-4xl xl:leading-tight dark:text-white">
//           Job Recruitment
//         </h1>
//         <p className="py-6 text-xl leading-normal text-[#8F8F8F] lg:text-xl xl:text-xl dark:text-gray-300">
//           Our fast resume miner will help you find the perfect candidate in
//           few seconds!
//         </p>

//         <div className="flex flex-col  items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
//           <a
//             href="https://web3templates.com/templates/nextly-landing-page-template-for-startups"
//             target="_blank"
//             rel="noopener"
//             className="px-7 py-3 text-lg font-medium text-center text-white bg-btnColor rounded-md "
//           >
//             Get Stared !
//           </a>
//         </div>
//         <div className="mt-16">
//           <ul className="flex flex-row gap-12 font-bold text-lg text-[#0E3374] list-disc list-inside mt-4 lg:text-xl">
//             <li>Skill Matching</li>
//             <li>Candidate Sourcing</li>
//             <li>Extraction </li>
//           </ul>
//         </div>
//         <div className="mt-4">
//           <ul className="flex flex-row gap-12 font-bold list-disc list-inside mt-4 text-lg lg:text-xl text-[#0E3374] ">
//             <li>Keyword matching </li>
//             <li>Additional Considerations</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//     <div className="flex items-center justify-center w-full lg:w-1/2">
//       <div className="mt-16 ">
//         <img
//           src={img}
//           width="575"
//           height="575"
//           className={"object-cover"}
//           alt="Hero Illustration"
//           loading="eager"
//           placeholder="blur"
//         />
//       </div>
//     </div>
//   </div>
// </>
