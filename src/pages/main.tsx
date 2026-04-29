import { useState } from "react";
import "../css/common.css";

export default function Main() {

  const [count, setCount] = useState(0);
    return (
    <div>
      <h2>Main Page</h2>

      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        +1
      </button>

      <button onClick={() => setCount(count - 1)}>
        -1
      </button>
    </div>
    );
  }