import React from "react";

const HomePage: React.FC = () => {
  return (
    <div>

      {/* HERO */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="fw-bold mb-3">Đặt lịch khám dễ dàng</h1>
          <p className="mb-4">Tìm bác sĩ, đặt lịch nhanh chóng và tiện lợi</p>

          <div className="d-flex justify-content-center">
            <input
              type="text"
              placeholder="Tìm bác sĩ, chuyên khoa..."
              className="form-control w-50 me-2"
            />
            <button className="btn btn-light">Tìm kiếm</button>
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="container py-5">
        <h3 className="mb-4">Chuyên khoa phổ biến</h3>

        <div className="row">
          {["Tim mạch", "Da liễu", "Nhi khoa", "Tai mũi họng"].map((item, i) => (
            <div className="col-md-3 mb-3" key={i}>
              <div className="card text-center p-3 shadow-sm">
                <h5>{item}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTORS */}
      <section className="container py-5">
        <h3 className="mb-4">Bác sĩ nổi bật</h3>

        <div className="row">
          {[1, 2, 3].map((_, i) => (
            <div className="col-md-4 mb-3" key={i}>
              <div className="card p-3 shadow-sm">
                <h5>Dr. Nguyễn Văn A</h5>
                <p className="text-muted">Tim mạch</p>
                <button className="btn btn-primary w-100">
                  Đặt lịch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light text-center py-5">
        <h3 className="mb-3">Bạn cần tư vấn nhanh?</h3>
        <p>Chat với AI hoặc đặt lịch với bác sĩ ngay</p>
        <button className="btn btn-primary">Bắt đầu</button>
      </section>

    </div>
  );
};

export default HomePage;