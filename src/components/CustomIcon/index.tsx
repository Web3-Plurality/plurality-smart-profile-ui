import { Image } from "antd"

const CustomIcon = ({ path }: { path: string }) => {
    return (
        <Image src={path} alt="" preview={false} />
    )
}

export default CustomIcon