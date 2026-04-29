import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../css/login.scss";
import { api } from "../../utils/api.ts";
import { useRef } from "react";

interface IForm {
  userId: string;
  userPw: string;
  userPw_re: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export default function Login() {

  const idCheckTimer = useRef<number | null>(null);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IForm>({
    mode: "onChange", // 실시간 검증
  });

  const onSubmit = async (data: IForm) => {
    try {
      await api.post('/api/member/join', data);
      alert('회원가입 완료');
      navigate('/Login');
    } catch (err: any) {
      if (err.response) {
        alert(`서버 오류: ${err.response.status}`);
      } else if (err.request) {
        alert('서버에 연결하지 못했습니다.');
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>회원가입</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 아이디 */}
          <input
            type="text"
            inputMode="email" // 영타로 변경
            placeholder="아이디 (영문/숫자 4~12자)"
            {...register("userId", {
              required: "아이디를 입력하세요.",
              minLength: { value: 4, message: "최소 4자 이상 입력해주세요." },
              maxLength: { value: 12, message: "최대 12자까지만 가능합니다." },
              pattern: {
                value: /^[a-z0-9]*$/,
                message: "영문 소문자와 숫자만 입력 가능합니다."
              },
              validate: async (value) => {
                if (value.length < 4) return true;
                if (idCheckTimer.current) {clearTimeout(idCheckTimer.current);
                }
                // 0.5초 기다렸다가 서버에 물어보는 '약속'을 리턴
                return new Promise((resolve) => {
                  // window.setTimeout을 쓰면 리턴 타입이 확실히 number가 되어 에러가 안 납니다.
                  idCheckTimer.current = window.setTimeout(async () => {
                    try {
                      const res = await api.post('/api/member/check-id', { userId: value });
                      
                      // 결과값(0 또는 1)에 따라 메시지 결정
                      const isDuplicate = res.data.checkResult === 1;
                      resolve(isDuplicate ? "이미 사용 중인 아이디입니다." : true);
                    } catch (err) {
                      resolve("서버 통신 오류가 발생했습니다.");
                    }
                  }, 500); // 0.5초 대기
                });
              }
            })}
          />
          {errors.userId && <p className="error-msg">{errors.userId.message}</p>}

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            {...register("userPw", {
              required: "비밀번호를 입력하세요.",
              minLength: { value: 4, message: "비밀번호는 최소 4자 이상입니다." },
              maxLength: { value: 20, message: "비밀번호는 최대 20자 이하입니다." }
            })}
          />
          {errors.userPw && <p className="error-msg">{errors.userPw.message}</p>}

          {/* 비밀번호 확인: watch 기능을 사용하여 비교 */}
          <input
            type="password"
            placeholder="비밀번호 확인"
            {...register("userPw_re", {
              required: "비밀번호 확인을 입력하세요.",
              validate: (value) => 
                value === watch("userPw") || "비밀번호가 일치하지 않습니다."
            })}
          />
          {errors.userPw_re && <p className="error-msg">{errors.userPw_re.message}</p>}

           {/* 이메일 */}
           <input
            type="text"
            placeholder="이름"
            {...register("userName", {
              required: "이름을 입력하세요.",
              maxLength:20
            })}
          />
          {errors.userName && <p className="error-msg">{errors.userName.message}</p>}

          {/* 이메일 */}
          <input
            type="email"
            placeholder="이메일"
            {...register("userEmail", 
              { required: "이메일을 입력하세요.",
                pattern:{
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "이메일 형식이 올바르지 않습니다."
                }
            })}
          />
          {errors.userEmail && <p className="error-msg">{errors.userEmail.message}</p>}

          {/* 전화번호: 숫자 패턴 적용 */}
          <input
            type="tel"
            placeholder="전화번호 (숫자만 입력)"
            maxLength={11}
            {...register("userPhone", {
              required: "전화번호를 입력하세요.",
              pattern: {
                value: /^[0-9]*$/,
                message: "숫자만 입력 가능합니다."
              }
            })}
          />
          {errors.userPhone && <p className="error-msg">{errors.userPhone.message}</p>}

          <button type="submit">가입 완료</button>
        </form>

        <Link to="/login" className="btn-join" style={{ border: 'none' }}>
          이전으로 돌아가기
        </Link>
      </div>
    </div>
  );
}