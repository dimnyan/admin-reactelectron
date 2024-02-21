import { useState } from "react";
// import logo from "./logo.svg";
// import "./App.css";

function App() {
  const [statusToken, setStatusToken] = useState("");
  const [idJadwal, setIdJadwal] = useState("");
  const [jadwalPenerbitan, setJadwalPenerbitan] = useState(null);
  const [bnspToken, setBnspToken] = useState(null);
  const [statusJadwal, setStatusJadwal] = useState(null);
  const [jadwals, setJadwals] = useState([]);
  const [jadwalInfo, setJadwalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logPenerbitan, setLogPenerbitan] = useState(false);

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

  const handlePenerbitanJadwal = async () => {
    setLoading(true);

    // Penerbitan Sertifikat
    try {
      const response = await fetch(
        "https://reguler.lspgatensi.id/api/uji/penerbitan-sertifikat",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer SEBUHAIUSDHAUISBFEBGENRERIBWOKT134G9349G3094B0935NBOI4NB0934N0934NB903J4B0935JB093N4B93N4B093HJB93H4GINO",
          },
          body: {
            jadwal_id: jadwalPenerbitan,
          },
        }
      );

      const data = await response.json();
      if (data.status === "error") {
        setLogPenerbitan(
          "penerbitan sertifikat error. message: " + data.message
        );
      }
    } catch (err) {
      setLogPenerbitan("penerbitan sertifikat error");
      console.error(err);
    }

    // CETAK JADWAL
    try {
      const response = await fetch(
        "https://reguler.lspgatensi.id/api/uji/cetak-jadwal",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer SEBUHAIUSDHAUISBFEBGENRERIBWOKT134G9349G3094B0935NBOI4NB0934N0934NB903J4B0935JB093N4B93N4B093HJB93H4GINO",
          },
          body: {
            jadwal_id: jadwalPenerbitan,
          },
        }
      );

      const data = await response.json();

      if (data.status === "error") {
        setLogPenerbitan(
          "penerbitan sertifikat error. message: " + data.message
        );
      }
    } catch (err) {
      setLogPenerbitan("cetak jadwal error");
      console.error(err);
    }

    setLoading(false);
  };

  // console.log(statusJadwal);

  return (
    <div style={{ padding: "10px" }}>
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
              value={idJadwal}
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
          <div>
            <br />
            <h1>Penerbitan Blanko</h1>
            <input
              type="text"
              onChange={(e) => setJadwalPenerbitan(e.target.value)}
              value={jadwalPenerbitan}
            />
            <button onClick={handlePenerbitanJadwal}>Terbitkan Jadwal</button>
            {logPenerbitan && <p style={{ color: "red" }}>{logPenerbitan}</p>}
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
    </div>
  );
}

export default App;
