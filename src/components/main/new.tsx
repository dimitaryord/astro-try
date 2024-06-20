import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DOMPurify from "dompurify"
import he from "he"

function New({ title, link, content}: { title: string, link: string, content: string}) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{DOMPurify.sanitize(he.decode(title))}</CardTitle>
            <CardDescription><a href={link}>{link}</a></CardDescription>
        </CardHeader>
        <CardContent>
            <p>{DOMPurify.sanitize(he.decode(content))}</p>
        </CardContent>
    </Card>
  )
}

export default New