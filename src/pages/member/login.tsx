
import { Link, useNavigate } from "react-router-dom";
import "../../css/login.scss";
import { useForm } from "react-hook-form";
import { freeApi } from "../../utils/api.ts";
import useAuthStore from "../../store/useAuthStore.tsx"

interface IForm {
  userId: string;
  userPw: string;
}

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    //watch,
    formState: { errors },
  } = useForm<IForm>({
    mode: "onChange", // 실시간 검증
  });
  
  const onSubmit = async (data: IForm) => {
    try {
      const rs = await freeApi.post('/api/member/login', data);
      if (rs.data.success != true){
        alert(rs.data.message);
        logout();
      }
      else{
        const { userMidx, userId, userName, accessToken, refreshToken } = rs.data;
        login(userMidx, userId, userName, accessToken, refreshToken);
        navigate('/');
      }
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
        <h2>로그인</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            }
          })}
        />
        {errors.userId && <p className="error-msg">{errors.userId.message}</p>}

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

        <button type="submit">로그인하기</button>
        </form>

        <Link to="/Join" className="btn-join">회원가입</Link>
      </div>
    </div>
  );
}