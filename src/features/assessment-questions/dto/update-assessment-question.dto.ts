import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentQuestionDto } from './create-assessment-question.dto';

export class UpdateAssessmentQuestionDto extends PartialType(CreateAssessmentQuestionDto) {}

// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import axios from "axios";
// import Apis from "../../APIs";
// import { useAuth } from "../Auth/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Assessment = () => {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(0);
//   const [result, setResult] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assessmentRecordId, setAssessmentRecordId] = useState(null);
//   const [redirectPage, setRedirectPage] = useState(null);

//   const optionLabels = ["A", "B", "C", "D"];

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(Apis.QUESTION_API);
//         const fetchedQuestions = response.data;
//         setQuestions(fetchedQuestions);
//         setAnswers(fetchedQuestions.map(() => Array(4).fill(null)));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError("Failed to load questions. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   const handleRatingSelect = (qIndex, oIndex, rating) => {
//     const newAnswers = [...answers];

//     if (newAnswers[qIndex][oIndex] === rating) {
//       newAnswers[qIndex][oIndex] = null;
//     } else {
//       const isRatingUsed = newAnswers[qIndex].some(
//         (selectedRating, index) => selectedRating === rating && index !== oIndex
//       );

//       if (isRatingUsed) {
//         toast.error(
//           You have already used rating ${rating} for another option in this question.
//         );
//         return;
//       }

//       newAnswers[qIndex][oIndex] = rating;
//     }

//     setAnswers(newAnswers);
//   };

//   const handleSubmit = async () => {
//     const incompleteQuestions = questions.some((question, qIndex) =>
//       answers[qIndex].some((rating) => rating === null)
//     );
  
//     if (incompleteQuestions) {
//       toast.error("Please Complete all the Assessments");
//       return;
//     }
  
//     setResult(true);
  
//     const formattedResponses = questions.map((question, qIndex) => ({
//       questionId: question._id,
//       ratings: answers[qIndex].map((rating) => ({ rating })),
//     }));
  
//     const userId = user._id;
  
//     const payload = {
//       userId: userId,
//       responses: formattedResponses,
//     };
  
//     try {
//       const response = await axios.post(Apis.ASSESSMENT_API, payload);
//       setAssessmentRecordId(response.data._id);
//       fetchAssessmentRecord(response.data._id);
      
//      if (user.feedbackStatus === "newUser") {
//       const updatedUserData = { feedbackStatus: "feedbackPending" };

//       await axios.put(${Apis.USER_API}/${user._id}, updatedUserData);
//       setUser({ ...user, feedbackStatus: "feedbackPending" });
//     }
//   } catch (error) {
//     console.error("Error submitting assessment:", error);
//   }
// };
  

//   const fetchAssessmentRecord = async (recordId) => {
//     try {
//       const response = await axios.get(
//         ${Apis.ASSESSMENT_API}/getAssessmentRecord/${recordId}
//       );
//       const optionStats = response.data.optionStats;
//       determineRedirect(optionStats);
//     } catch (error) {
//       console.error("Error fetching assessment record:", error);
//     }
//   };
  

//   const determineRedirect = (optionStats) => {
//     const maxOption = Object.entries(optionStats).reduce(
//       (acc, [key, value]) => {
//         if (value[1] > acc.count) {
//           return { key, count: value[1] };
//         }
//         return acc;
//       },
//       { key: null, count: 0 }
//     );

//     switch (maxOption.key) {
//       case 'option1':
//         setRedirectPage("/PdfD"); 
//         break;
//       case 'option2':
//         setRedirectPage("/PdfG");
//         break;
//       case 'option3':
//         setRedirectPage("/PdfC");
//         break;
//       case 'option4':
//         setRedirectPage("/PdfS");
//         break;
//       default:
//         setRedirectPage("/dashboard"); 
//     }
//   };

//   const handleOkClick = async () => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(${Apis.USER_API}/${user._id}, {
//           headers: {
//             Authorization: Bearer ${localStorage.getItem("token")},
//           },
//         });
//         const updatedUserData = response.data;
//         setUser(updatedUserData);
//       } catch (error) {
//         console.error("Error refreshing user data:", error);
//       }
//     };
  
//     const updatePdfAccess = async () => {
//       try {
//         const pdfName = redirectPage.replace("/", "");
  
//         await axios.put(
//           ${Apis.USER_API}/${user._id},
//           { pdfAccess: [...user.pdfAccess, pdfName] },
//           {
//             headers: {
//               Authorization: Bearer ${localStorage.getItem("token")},
//             },
//           }
//         );
  
//         await fetchUserData();
//       } catch (error) {
//         console.error("Error updating pdfAccess:", error);
//         toast.error("Failed to update PDF access. Please try again later.");
//       }
//     };
  
//     await updatePdfAccess();
//     navigate(redirectPage);
//   };
  

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-primary-gradient">
//         <l-infinity
//           size="200"
//           stroke="4"
//           stroke-length="0.15"
//           bg-opacity="0.1"
//           speed="1.3"
//           color="white"
//         ></l-infinity>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <section className="min-h-screen w-full bg-primary-gradient flex items-center justify-center">
//         <div className="text-white text-2xl">{error}</div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="min-h-screen w-full bg-primary-gradient flex flex-col items-center justify-center p-5">
//         {result ? (
//           <div className="min-h-[400px] w-80 md:w-[400px] rounded-lg bg-secondary p-5 flex items-center justify-center flex-col gap-5">
//             <h2 className="text-3xl text-center">
//               Thank you for giving the assessment
//             </h2>
//             <h2 className="text-3xl text-center">
//               To See Your Result Click Ok
//             </h2>
//             <FaMedal className="text-4xl text-yellow-400" />
//             <button
//               onClick={handleOkClick}
//               className="h-10 w-full rounded-lg bg-green-500 text-white hover:bg-green-700"
//             >
//               Ok
//             </button>
//           </div>
//         ) : (
//           <>

//           <div className=" w-screen max-w-[90%] md:max-w-[900px] rounded-lg bg-secondary p-5">
//             <h2 className="font-bold text-xl mb-5">
//               Know Your Competency (KYC) - Assessment on DGCS Leadership Style :
//               -{" "}
//             </h2>
//             <h2 className="font-semibold text-base mb-5">
//               Please choose your rating based on your preference. Rank 1 - Most
//               Agreed; 2 - Agreed; 3 - Lesser agreed; 4 - Least Agreed. -{" "}
//             </h2>
//             <h2 className="font-semibold text-base mb-5">
//               only one option should be given for each rank for each questions.
//               For the question one - if you give rank 4 for 1st option, the same
//               rank 4 cannot be given for the other 3 options : -{" "}
//             </h2>
//             </div>

//             <div className=" w-screen max-w-[90%] md:max-w-[900px] rounded-lg bg-secondary p-5 mt-10">
//             {questions.map((q, qIndex) => (
//               <div key={q._id} className="mb-6">
//                 <h3 className="font-semibold text-lg mb-3">
//                   {qIndex + 1}. {q.mainQuestion}
//                 </h3>
//                 <div className="flex flex-col gap-3">
//                   {q.options.map((option, oIndex) => (
//                     <div
//                       key={option._id}
//                       className="items-start justify-start flex flex-col md:flex-row md:items-center md:justify-between "
//                     >
//                       <span>{(${optionLabels[oIndex]}) ${option.option}}</span>
//                       <div className="flex gap-10">
//                         {[1, 2, 3, 4].map((rating) => {
//                           const isRatingUsed = answers[qIndex].some(
//                             (selectedRating, index) =>
//                               selectedRating === rating && index !== oIndex
//                           );

//                           return (
//                             <button
//                               key={rating}
//                               onClick={() =>
//                                 handleRatingSelect(qIndex, oIndex, rating)
//                               }
//                               className={w-8 h-8  rounded-full border-2 flex items-center justify-center ${
//                                 answers[qIndex][oIndex] === rating
//                                   ? "bg-green-500 text-white"
//                                   : isRatingUsed
//                                   ? "bg-gray-300 text-white" 
//                                   : "border-gray-300 hover:bg-green-400"
//                               }}
//                               disabled={isRatingUsed} 
//                             >
//                               {rating}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             <div className="mt-5 flex justify-end">
//               <button
//                 onClick={handleSubmit}
//                 className="h-10 w-32 rounded-lg bg-green-500 text-white hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//           </>

//         )}
//       </section>
//       <ToastContainer />
//     </>
//   );
// };

// export default Assessment;





// import React, { useState, useEffect } from "react";
// import { FaMedal } from "react-icons/fa";
// import axios from "axios";
// import Apis from "../../APIs";
// import { useAuth } from "../Auth/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Assessment = () => {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [result, setResult] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [assessmentRecordId, setAssessmentRecordId] = useState(null);
//   const [redirectPage, setRedirectPage] = useState(null);

//   const optionLabels = ["A", "B", "C", "D"];

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(Apis.QUESTION_API);
//         const fetchedQuestions = response.data;
//         setQuestions(fetchedQuestions);
//         setAnswers(fetchedQuestions.map(() => Array(4).fill(null)));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError("Failed to load questions. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   const handleRatingSelect = (oIndex, rating) => {
//     const newAnswers = [...answers];
//     const qIndex = currentQuestionIndex;

//     if (newAnswers[qIndex][oIndex] === rating) {
//       newAnswers[qIndex][oIndex] = null;
//     } else {
//       const isRatingUsed = newAnswers[qIndex].some(
//         (selectedRating, index) => selectedRating === rating && index !== oIndex
//       );

//       if (isRatingUsed) {
//         toast.error(
//           `You have already used rating ${rating} for another option in this question.`
//         );
//         return;
//       }

//       newAnswers[qIndex][oIndex] = rating;
//     }

//     setAnswers(newAnswers);
//   };

//   const handleNextQuestion = () => {
//     if (answers[currentQuestionIndex].some((rating) => rating === null)) {
//       toast.error("Please answer the current question before moving to the next.");
//       return;
//     }

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       handleSubmit(); // Submit when the last question is answered
//     }
//   };

//   const handleSubmit = async () => {
//     setResult(true);

//     const formattedResponses = questions.map((question, qIndex) => ({
//       questionId: question._id,
//       ratings: answers[qIndex].map((rating) => ({ rating })),
//     }));

//     const userId = user._id;

//     const payload = {
//       userId: userId,
//       responses: formattedResponses,
//     };

//     try {
//       const response = await axios.post(Apis.ASSESSMENT_API, payload);
//       setAssessmentRecordId(response.data._id);
//       fetchAssessmentRecord(response.data._id);
      
//       if (user.feedbackStatus === "newUser") {
//         const updatedUserData = { feedbackStatus: "feedbackPending" };
//         await axios.put(`${Apis.USER_API}/${user._id}`, updatedUserData);
//         setUser({ ...user, feedbackStatus: "feedbackPending" });
//       }
//     } catch (error) {
//       console.error("Error submitting assessment:", error);
//     }
//   };

//   const fetchAssessmentRecord = async (recordId) => {
//     try {
//       const response = await axios.get(
//         `${Apis.ASSESSMENT_API}/getAssessmentRecord/${recordId}`
//       );
//       const optionStats = response.data.optionStats;
//       determineRedirect(optionStats);
//     } catch (error) {
//       console.error("Error fetching assessment record:", error);
//     }
//   };

//   const determineRedirect = (optionStats) => {
//     const maxOption = Object.entries(optionStats).reduce(
//       (acc, [key, value]) => {
//         if (value[1] > acc.count) {
//           return { key, count: value[1] };
//         }
//         return acc;
//       },
//       { key: null, count: 0 }
//     );

//     switch (maxOption.key) {
//       case 'option1':
//         setRedirectPage("/PdfD"); 
//         break;
//       case 'option2':
//         setRedirectPage("/PdfG");
//         break;
//       case 'option3':
//         setRedirectPage("/PdfC");
//         break;
//       case 'option4':
//         setRedirectPage("/PdfS");
//         break;
//       default:
//         setRedirectPage("/dashboard"); 
//     }
//   };

//   const handleOkClick = async () => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`${Apis.USER_API}/${user._id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const updatedUserData = response.data;
//         setUser(updatedUserData);
//       } catch (error) {
//         console.error("Error refreshing user data:", error);
//       }
//     };
  
//     const updatePdfAccess = async () => {
//       try {
//         const pdfName = redirectPage.replace("/", "");
  
//         await axios.put(
//           `${Apis.USER_API}/${user._id}`,
//           { pdfAccess: [...user.pdfAccess, pdfName] },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
  
//         await fetchUserData();
//       } catch (error) {
//         console.error("Error updating pdfAccess:", error);
//         toast.error("Failed to update PDF access. Please try again later.");
//       }
//     };
  
//     await updatePdfAccess();
//     navigate(redirectPage);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-primary-gradient">
//         <l-infinity
//           size="200"
//           stroke="4"
//           stroke-length="0.15"
//           bg-opacity="0.1"
//           speed="1.3"
//           color="white"
//         ></l-infinity>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <section className="min-h-screen w-full bg-primary-gradient flex items-center justify-center">
//         <div className="text-white text-2xl">{error}</div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="min-h-screen w-full bg-primary-gradient flex flex-col items-center justify-center p-5">
//         {result ? (
//           <div className="min-h-[400px] w-80 md:w-[400px] rounded-lg bg-secondary p-5 flex items-center justify-center flex-col gap-5">
//             <h2 className="text-3xl text-center">
//               Thank you for giving the assessment
//             </h2>
//             <h2 className="text-3xl text-center">
//               To See Your Result Click Ok
//             </h2>
//             <FaMedal className="text-4xl text-yellow-400" />
//             <button
//               onClick={handleOkClick}
//               className="h-10 w-full rounded-lg bg-green-500 text-white hover:bg-green-700"
//             >
//               Ok
//             </button>
//           </div>
//         ) : (
//           <>
//           <div className=" w-screen max-w-[90%] md:max-w-[900px] rounded-lg bg-secondary p-5">
//             <h2 className="font-bold text-xl mb-5">
//               Know Your Competency (KYC) - Assessment on DGCS Leadership Style :
//               -{" "}
//             </h2>
//             <h2 className="font-semibold text-base mb-5">
//               Please choose your rating based on your preference. Rank 1 - Most
//               Agreed; 2 - Agreed; 3 - Lesser agreed; 4 - Least Agreed. -{" "}
//             </h2>
//             <h2 className="font-semibold text-base mb-5">
//               only one option should be given for each rank for each questions.
//               For the question one - if you give rank 4 for 1st option, the same
//               rank 4 cannot be given for the other 3 options : -{" "}
//             </h2>
//             </div>
//             <div className="w-screen max-w-[90%] md:max-w-[900px] mt-5 rounded-lg bg-secondary p-5">
//             <div className="text-lg text-black font-bold mb-3 flex items-center justify-center">
//               {currentQuestionIndex + 1} / {questions.length}
//             </div>
//               <h3 className="font-semibold text-lg mb-3">
//                 {currentQuestionIndex + 1}. {questions[currentQuestionIndex].mainQuestion}
//               </h3>
//               <div className="flex flex-col gap-3">
//                 {questions[currentQuestionIndex].options.map((option, oIndex) => (
//                   <div
//                     key={option._id}
//                     className="items-start justify-start flex flex-col md:flex-row md:items-center md:justify-between"
//                   >
//                     <span>{`(${optionLabels[oIndex]}) ${option.option}`}</span>
//                     <div className="flex gap-10">
//                       {[1, 2, 3, 4].map((rating) => {
//                         const isRatingUsed = answers[currentQuestionIndex].some(
//                           (selectedRating, index) =>
//                             selectedRating === rating && index !== oIndex
//                         );

//                         return (
//                           <button
//                             key={rating}
//                             onClick={() => handleRatingSelect(oIndex, rating)}
//                             className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
//                               answers[currentQuestionIndex][oIndex] === rating
//                                 ? "bg-green-500 text-white"
//                                 : isRatingUsed
//                                 ? "bg-gray-300 text-white"
//                                 : "border-gray-300 hover:bg-green-400"
//                             }`}
//                             disabled={isRatingUsed}
//                           >
//                             {rating}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-5 flex justify-end">
//                 <button
//                   onClick={handleNextQuestion}
//                   className="h-10 w-32 rounded-lg bg-green-500 text-white hover:bg-green-700"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </section>
//       <ToastContainer />
//     </>
//   );
// };

// export default Assessment;
