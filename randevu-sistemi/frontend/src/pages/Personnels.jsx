import { useEffect, useState } from "react";
import { getPersonnels } from "../services/api";

function Personnels() {

  const [personnels, setPersonnels] = useState([]);

  useEffect(() => {

    getPersonnels()
      .then((res) => setPersonnels(res.data))
      .catch(console.error);

  }, []);

  return (
    <>
      <h1>Personeller</h1>

      <div className="dashboard-grid">

        {personnels.map((person) => (

          <div
            key={person.id}
            className="card"
          >
            <h3>{person.name}</h3>

            <p>
              🕘
              {" "}
              {person.working_start}
              {" "}
              -
              {" "}
              {person.working_end}
            </p>

          </div>

        ))}

      </div>

    </>
  );
}

export default Personnels;