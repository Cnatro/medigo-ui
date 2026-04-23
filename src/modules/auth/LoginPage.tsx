import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import "./styles/login.css";
import { useAuth } from "./hooks/useAuth";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password, });
  };

  return (
    <Container fluid className="login-container">
      <Card className="login-card">
        <Card.Body>
          <div className="text-center mb-3">
            <div className="logo">❤️</div>
            <h3 className="brand">MediGo</h3>
            <p className="subtitle">Nền tảng y tế hàng đầu Việt Nam</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ tôi"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
              </Col>
              <Col className="text-end">
                <a href="#">Quên mật khẩu?</a>
              </Col>
            </Row>

            <Button type="submit" className="w-100 login-btn">
              Đăng nhập →
            </Button>
          </Form>

          <div className="divider">
            <span>HOẶC TIẾP TỤC VỚI</span>
          </div>

          <Button variant="light" className="google-btn w-100">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="google"
              width={20}
            />
            <span className="ms-2">Google</span>
          </Button>

          <div className="text-center mt-3">
            <span>Chưa có tài khoản? </span>
            <Link to="/register">Đăng ký ngay</Link>
          </div>

          <div className="terms text-center mt-3">
            Bằng cách đăng nhập, bạn đồng ý với <br />
            <a href="#">Điều khoản dịch vụ</a> và{" "}
            <a href="#">Chính sách bảo mật</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;