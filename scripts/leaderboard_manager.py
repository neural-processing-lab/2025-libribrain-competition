import json
import os
import sys

import requests


class LeaderboardManager:
    def __init__(self):
        self.challenge_id = None
        self.phase_split_ids = None
        self.evalai_token = None
        self.evalai_host = None
        self.output_dir = None
        self.load_env()

    def load_env(self):
        """
        Read EvalAI environment variables
        """
        self.challenge_id = os.getenv("CHALLENGE_ID")
        self.phase_split_ids = os.getenv("CHALLENGE_PHASE_SPLIT_IDS").split(",")
        self.evalai_token = os.getenv("EVALAI_TOKEN")
        self.evalai_host = os.getenv("EVALAI_HOST_URL")
        self.output_dir = os.getenv("OUTPUT_DIR", ".")

    def get_request_headers(self):
        """
        Function to get the header of the EvalAI request in proper format

        Returns
        -------
        dict
            Authorization header
        """
        headers = {"Authorization": "Bearer {}".format(self.evalai_token)}
        return headers

    def make_request(self, url, method="GET", data=None):
        """
        Function to make request to EvalAI interface

        Parameters
        ----------
        url : str
            URL of the request
        method : str, optional
            Method of the request, by default "GET"
        data : dict, optional
            Data of the request, by default None

        Returns
        -------
        JSON
            JSON response data
        """
        headers = self.get_request_headers()
        try:
            response = requests.request(
                method=method, url=url, headers=headers, data=data
            )
            response.raise_for_status()
        except requests.exceptions.RequestException:
            print("The server isn't able establish connection with EvalAI")
            raise
        return response

    def fetch_leaderboard(self, phase_split_id):
        """
        Fetch leaderboard using EvalAI API

        Parameters
        ----------
        phase_split_id : str
            EvalAI challenge phase split ID

        Returns
        -------
        JSON
            Leaderboard in JSON format
        """
        url = "{}/api/jobs/challenge_phase_split/{}/leaderboard/".format(
            self.evalai_host, phase_split_id
        )
        return self.make_request(url)

    @staticmethod
    def sort_dict(input_dict, sort_key="date"):
        """
        Sort dictionary with specified key

        Parameters
        ----------
        input_dict : dict
            Leaderboard dictionary to filter
        sort_key : str, optional
            Key to sort the dictionary, by default "date"

        Returns
        -------
        dict
            Sorted leaderboard in dictionary
        """
        return sorted(input_dict, key=lambda x: x[sort_key])

    def filter_leaderboard(self, response, sort=True):
        """
        Filter out fields of intrest from the EvalAI leaderboard in JSON

        Parameters
        ----------
        response : JSON
            EvalAI leaderboard with all metadata
        sort : bool, optional
            If want to sort leaderboard, by default True

        Returns
        -------
        dict
            Leaderboard with only required fields
        """
        output = []
        response_dict = response.json()

        results = response_dict["results"]
        for result in results:
            print(result["submission__method_name"], result["result"][0])
            output.append(
                {
                    "method": result["submission__method_name"],
                    "score": result["result"][0],
                    "date": result["submission__submitted_at"],
                }
            )

        if sort:
            return self.sort_dict(output)
        return output

    def write_leaderbaord_json(self, output, phase_split_id):
        """
        Write filtered leaderboard in json file

        Parameters
        ----------
        output : dict
            Filtered leaderboard to write
        phase_split_id : str
            EvalAI challenge phase split ID
        """
        try:
            with open(
                f"{self.output_dir}/leaderboard_{phase_split_id}.json", "w"
            ) as file:
                json.dump(output, file, indent=2)
        except (PermissionError, OSError):
            print("Error opening leaderboard file!")
            sys.exit(1)

    def update(self):
        """
        Main function that retrieves the leaderboard from EvalAI, filteres it and
        write to a json file
        """
        for phase_split_id in self.phase_split_ids:
            response = self.fetch_leaderboard(phase_split_id)
            output = self.filter_leaderboard(response)
            self.write_leaderbaord_json(output, phase_split_id)


if __name__ == "__main__":
    leaderboard_manager = LeaderboardManager()
    leaderboard_manager.update()
