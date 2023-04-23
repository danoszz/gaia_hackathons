"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"

import Image from "next/image"

import styles from "./InputPrompt.module.scss"

const handleStyle = { left: 10 }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function TextUpdaterNode({ data, isConnectable }) {
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("handleSubmit", e.target.prompt.value)

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value
      })
    })
    console.log("response11", response)

    let prediction = await response.json()

    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }

    console.log("prediciton FE", prediction)
    setPrediction(prediction)

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000)
      const response = await fetch("/api/predictions/" + prediction.id)
      prediction = await response.json()

      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }
      console.log("prediction1", prediction)
      setPrediction(prediction)
    }
  }

  return (
    <div className={styles.promptInputNode}>
      <Handle
        type="target"
        id="c"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">Prompt</label>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter a prompt to display an image"
          />
          <button type="submit">Go!</button>
        </form>
        <div className={styles.imageBox}>
          {error && <div>{error}</div>}

          {prediction && (
            <div>
              {prediction.output && (
                <div className={styles.imageWrapper}>
                  <Image
                    fill
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    sizes="100vw"
                  />
                </div>
              )}
              <p>status: {prediction.status}</p>
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  )
}

export default TextUpdaterNode
