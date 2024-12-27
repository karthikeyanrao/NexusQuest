import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillArrowRightCircleFill, BsArrowRight } from "react-icons/bs";
import Link from "next/link"; 

const Tournament = () => {
  const [tournamentName, setTournamentName] = useState("");
  const [gameName, setGameName] = useState("");
  const [type, setType] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState("");
  const [teamNames, setTeamNames] = useState("");
  const router = useRouter();

  const tournamentNameHandler = (event) => {
    setTournamentName(event.target.value);
  };
  const gameNameHandler = (event) => {
    setGameName(event.target.value);
  };
  const typeHandler = (event) => {
    setType(event.target.value);
  };

  const numberOfTeamsHandler = (event) => {
    setNumberOfTeams(event.target.value);
  };

  const teamNamesHandler = (event) => {
    setTeamNames(event.target.value);
  };

  function generateRandomTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10;
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log("form submit..");
    try {
      const randomNum = generateRandomTwoDigitNumber();
      localStorage.setItem("TournId", randomNum);
      if (type == "undefined") return alert("type not set!");
      console.log(
        tournamentName,
        gameName,
        type,
        numberOfTeams,
        teamNames,
        randomNum
      );
      localStorage.setItem("gameId", 0);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentName,
          gameName,
          type,
          numberOfTeams,
          teamNames,
          randomNum,
        }),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Data sent successfully!");
      } else {
        // Handle error response
        console.log("Failed to send data!");
      }

      const propsToSend = {
        tname: tournamentName,
      };

      router.push({
        pathname: "/stream",
        // query: propsToSend,
      });
    } catch (error) {
      // Handle network error
      console.error("Failed to send data:", error);
    }
  };

  return (
    <div>
      <div className='h-screen bg-black'>
        <div className="grid mb-0 pt-5 pb-5 mt-0 md:mb-10 md:grid-cols-2 ">
          <figure className="flex flex-col pt-10 ">

            <div className="text-left align-left w-[750px] p-8 pl-[100px]">
              <div className="mb-2  bg-gradient-to-r from-[#fff] via-[#fff]/80 to-[#9d9ea1]/50 bg-clip-text 
                            text-transparent font-bold font-Agda text-[80px] uppercase md:max-w-4xl max-w-[575px]">
                Tournament Generator
              </div>
              <p className='text-white pb-10'>
                Create your tournament brackets here..
                <br />

              </p>

            </div>
          </figure>

          <figure className="flex flex-col items-center justify-center pt-10 pr-20 ">
            <div className="text-center px-[50px] align-middle w-[650px] h-[650px] p-8 bg-[#202020] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <form onSubmit={onFormSubmit}>
                <div className=" flex flex-col text-left mb-6 mt-6">
                  <label
                    htmlFor="text"
                    className=" mb-2 text-lg font-medium text-white dark:text-white"
                  >
                    Enter Tournament Name
                  </label>
                  <input
                    type="text"
                    id="input-name"
                    onChange={tournamentNameHandler}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="Road to victory, fight till last breath,.."
                    required
                  />
                </div>
                <div className=" flex flex-col text-left mb-6 mt-6">
                  <label
                    htmlFor="text"
                    className=" mb-2 text-lg font-medium text-white dark:text-white"
                  >
                    Enter Game Name
                  </label>
                  <input
                    type="text"
                    id="input-name"
                    onChange={gameNameHandler}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="Valorant"
                    required
                  />
                </div>
                <div className=" flex flex-col text-left mb-6 mt-6">
                  <label
                    htmlFor="text"
                    className=" mb-2 text-lg font-medium text-white dark:text-white"
                  >
                    Enter Tournament Type
                  </label>
                  <select
                    onChange={typeHandler}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  >
                    <option value="undefined" selected>
                      --Select Type--
                    </option>
                    <option value="single_elimination">Single Elimination</option>
                    <option value="double_elimination">Double Elimination</option>
                    <option value="round_robin">Round Robin</option>
                  </select>
                  {/* <input
                type="text"
                id="input-name"
                onChange={typeHandler}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Single Elimination, Double Elimination, Round Robin"
                required
              /> */}
                </div>
                <div className=" flex flex-col text-left mb-6">
                  <label
                    htmlFor="text"
                    className=" mb-2 text-lg font-medium text-white dark:text-white"
                  >
                    Enter Number Of Teams
                  </label>
                  <input
                    type="number"
                    id="input-name"
                    onChange={numberOfTeamsHandler}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="Total Number Of Teams"
                    required
                  />
                </div>
                <div className=" flex flex-col text-left mb-6">
                  <label
                    htmlFor="text"
                    className=" mb-2 text-lg font-medium text-white dark:text-white"
                  >
                    Enter Name Of Teams
                  </label>
                  <input
                    type="text"
                    id="input-name"
                    onChange={teamNamesHandler}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="Team Vitalik, Team Satoshi.."
                    required
                  />
                </div>
                <div className="flex flex-row justify-start ">
                  <button
                    className="flex justify-start relative text-lg px-8 py-3 bg-[#98ee2c]  mr-5 uppercase font-Agda font-bold text-black hover:bg-[#f0f0f0] cursor-pointer" >
                    Create Brackets
                    <BsArrowRight className=' ml-2' />
                  </button>
                </div>
              </form>
            </div>
          </figure>

        </div>
      </div>

    </div>
  );
};

export default Tournament;
