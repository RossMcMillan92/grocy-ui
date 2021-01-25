import { APP_CONTAINER_ID } from "pages/_app"
import { XOutline } from "heroicons-react"
import { useRouter } from "next/router"
import Heading from "./Heading"
import React from "react"
import ReactModal from "react-modal"
import classNames from "helpers/classNames"

if (
  typeof window !== "undefined" &&
  document.getElementById(APP_CONTAINER_ID) != null
) {
  ReactModal.setAppElement(`#${APP_CONTAINER_ID}`)
}

type ModalProps = {
  children: React.ReactNode
  onRequestClose: () => void
  title: string
}

const Modal: React.FC<ModalProps> = ({
  children,
  onRequestClose,
  title,
  ...props
}) => {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = React.useState(true)

  React.useEffect(() => {
    window.requestAnimationFrame(() => {
      setIsTransitioning(false)
    })
  }, [])

  React.useEffect(() => {
    router.push(`${document.location.pathname}#modal`, undefined, {
      shallow: true,
    })

    const cb = () => {
      onRequestClose()
    }
    window.addEventListener("hashchange", cb)

    return () => {
      window.removeEventListener("hashchange", cb)
    }
  }, [])

  const onClose = () => {
    router.replace(`${document.location.pathname}`, undefined, {
      shallow: true,
    })
    onRequestClose()
  }

  return (
    <ReactModal
      isOpen={true}
      bodyOpenClassName="overflow-hidden"
      style={{
        overlay: { backgroundColor: "transparent", zIndex: 9999 },
        content: {
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "0",
          padding: "0",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
        },
      }}
      onRequestClose={onClose}
      {...props}
    >
      <div className="flex items-end h-full p-2 2xs:p-4 sm:items-center">
        <div className={classNames("w-full max-h-full flex flex-col")}>
          <button
            className={classNames(
              "absolute inset-0 w-full h-full bg-black transition-opacity duration-500 ease-in-out",
              !isTransitioning && "opacity-75",
              isTransitioning && "opacity-0",
            )}
            onClick={onClose}
            tabIndex={-1}
            aria-label="Close modal."
          />
          <div
            className={classNames(
              "scrolling-touch overflow-auto",
              "bg-white shadow-lg rounded-lg",
              "relative transform h-full w-full max-w-xs mx-auto",
              "delay-200 transition-all duration-150 ease-out",
              isTransitioning && "scale-90 opacity-0",
            )}
          >
            <div className="flex justify-between px-4 pt-4 sm:px-6 sm:pt-6">
              <Heading.H2 className={classNames("text-gray-700")}>
                {title}
              </Heading.H2>

              <button
                className="w-12 h-12 -mr-3 -mt-3 flex items-center justify-center"
                onClick={onClose}
                aria-label={`Exit ${title}`}
              >
                <XOutline className="w-7 h-7 text-gray-500" />
              </button>
            </div>

            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default Modal
