import { useState } from 'react';

interface ChildProps {
    chType: string;
    onplay: (val: string) => void;
  }

function ChildComponent({ chType, onplay }: ChildProps) {
  return (
    <div style={{ border: '2px solid #3498db', padding: '15px', marginTop: '10px', borderRadius: '8px' }}>
      <h3>자식 컴포넌트</h3>
      <p>부모로부터 받은 데이터: <mark>{chType}</mark></p>
      {chType === "밥먹었니?" ? (
        <button onClick={() => onplay("많이 먹었어요.")}>대답</button>
      ) : (
        <button onClick={() => onplay("공부 다 했어요!")}>대답</button>  
      )}
    </div>
  );
}

export default function ParentComponent() {
  const [parentData, setParentData] = useState("(대기 중)");
  const [childData, setChildData] = useState("(대기 중)");

  const mq = (aa: string) =>{
    if(aa === "a"){setParentData("공부중이니?");setChildData("(대기 중)");}
    if(aa === "b"){setParentData("밥먹었니?");setChildData("(대기 중)");}
  }

  return (
    <div style={{ border: '2px solid #e74c3c', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
      <h2>부모 컴포넌트</h2>
      <button onClick={() => mq("a")}>질문1</button>
      <span> / </span>
      <button onClick={() => mq("b")}>질문2</button>
      <p>자식의 응답: <mark>{childData}</mark></p>
      <hr />
      
      {/* 자식 컴포넌트 사용 */}
      <ChildComponent 
        chType={parentData} 
        onplay={(val) => setChildData(val)} 
      />
    </div>
  );
}