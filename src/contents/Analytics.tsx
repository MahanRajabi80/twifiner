import cssText from "data-text:~contents/styles.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { IoAnalyticsSharp } from "react-icons/io5"

import { readStorageAsBoolean, watchSettings } from "~storage"
import * as utils from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*"]
}

export const getRootContainer = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (document.querySelector(`#analytics-button`)) return
      const rootContainerParent = document.querySelector(
        `nav[aria-label="Primary"]`
      ) as HTMLElement

      if (rootContainerParent) {
        const rootContainer = document.createElement("div")
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const AnalyticsButton = () => {
  const [display, setDisplay] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  let bgHoverColor = "#e7e7e8"
  let bgColor = "#ffffff"

  if (utils.getCurrentTheme() === "dark") {
    bgHoverColor = "#181818"
    bgColor = "#000000"
  } else if (utils.getCurrentTheme() === "dim") {
    bgHoverColor = "#2c3640"
    bgColor = "#15202b"
  } else {
    bgHoverColor = "#e7e7e8"
    bgColor = "#ffffff"
  }

  watchSettings(() => {
    readStorageAsBoolean("add_analytics_button").then((value) => {
      setDisplay(value)
    })
  })

  const [username, setUsername] = useState("")

  useEffect(() => {   
    const profileLink = document.querySelector(
      'nav[aria-label] a[aria-label="Profile"]'
    )
    if (profileLink) {
      setUsername(profileLink.getAttribute("href").replace("/", ""))
    }
  }, [])

  return (
    display && (
      <a
        id="analytics-button"
        href={`https://analytics.twitter.com/user/${username}/home`}
        aria-label="Analytics"
        style={{
          backgroundColor: isHovering ? bgHoverColor : bgColor
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center no-underline decoration-inherit text-inherit p-3 rounded-full"
        role="link">
        <IoAnalyticsSharp className="w-[22px] h-[22px]"/>

        <span id="twifiner-analytics-label" className="text-xl mx-5">
          Analytics
        </span>
      </a>
    )
  )
}

export const render = async ({ anchor, createRootContainer }) => {
  const rootContainer = await createRootContainer()

  const root = createRoot(rootContainer)
  root.render(<AnalyticsButton />)
}

export default AnalyticsButton
