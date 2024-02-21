import { useState } from "react";
// import logo from "./logo.svg";
// import "./App.css";

function App() {
  const [statusToken, setStatusToken] = useState("");
  const [idJadwal, setIdJadwal] = useState("");
  const [bnspToken, setBnspToken] = useState(null);
  const [statusJadwal, setStatusJadwal] = useState(null);
  const [jadwals, setJadwals] = useState([]);
  const [jadwalInfo, setJadwalInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // const bnspAuth = useRef("");

  // const bnspAuth =
  //   "$2y$10$ZAQlNE.D0Vy7P9R79N0nPOZcERAdVJIlKeAVhWEEBd3GJoziQmFOW";

  const handleGetToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://konstruksi.bnsp.go.id/api/v1/auth",
        {
          method: "POST",
          headers: {
            "x-bnsp-user": "lsp-g4t3ns1",
            "x-bnsp-key": "g4t3ns1k0nstrUks1",
          },
        }
      );
      const token = await response.json();

      setBnspToken(token.data.token);
      setStatusToken("Token Get!");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleGetBlanko = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://konstruksi.bnsp.go.id/api/v1/jadwal?limit=10&status_blanko=${statusJadwal}`,
        { headers: { "x-authorization": bnspToken } }
      );

      const data = await response.json();
      const jadwalArray = data.data.map((item) => item.id);
      setJadwals(jadwalArray);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGetJadwal = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://konstruksi.bnsp.go.id/api/v1/jadwal/blanko?jadwal_id=${idJadwal}`,
        { headers: { "x-authorization": bnspToken } }
      );
      const data = await response.json();

      setJadwalInfo(data.dataJadwal);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // console.log(statusJadwal);

  return (
    <>
      {loading && (
        <h3 style={{ color: "red", textAlign: "center" }}>LOADING</h3>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div>
            <h1>Get Jadwal by Status</h1>
            <select
              onChange={(e) => {
                setStatusJadwal(e.target.value);
              }}
            >
              <option value=""></option>
              <option value="2">Sedang Pengajuan</option>
              <option value="22">Blanko Dikirim</option>
              <option value="23">Blanko Dikirim 2</option>
            </select>
            <button onClick={handleGetBlanko}>Get Jadwal</button>
            <div style={{ paddingLeft: "10px" }}>
              {jadwals.length > 0 && (
                <>
                  <p>
                    Jml Jadwal : <b>{jadwals && jadwals.length}</b>
                  </p>
                  <p>ID Jadwal :</p>
                  <b>
                    <ul>
                      {jadwals.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </b>
                </>
              )}
            </div>
          </div>

          <div>
            <br />
            <h1>Get Jadwal by ID</h1>
            <input
              type="text"
              onChange={(e) => setIdJadwal(e.target.value)}
            ></input>
            <button onClick={handleGetJadwal}>Get Jadwal</button>
            <div style={{ paddingLeft: "10px" }}>
              {jadwalInfo && <h3>Info Jadwal: </h3>}
              {jadwalInfo?.nama_tuk && (
                <p>
                  TUK : <b>{jadwalInfo.nama_tuk}</b>
                </p>
              )}
              {jadwalInfo?.tanggal_mulai && (
                <p>
                  Tgl Uji : <b>{jadwalInfo.tanggal_mulai}</b>
                </p>
              )}
              {jadwalInfo?.status_blanko && (
                <p>
                  Status Blanko : <b>{jadwalInfo.status_blanko}</b>
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ paddingRight: "50px" }}>
          <h1>Get Token</h1>
          <button onClick={handleGetToken}>Get Token</button>
          <div style={{ paddingLeft: "10px" }}>
            {bnspToken ? <p style={{ color: "green" }}>{statusToken}</p> : ""}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
