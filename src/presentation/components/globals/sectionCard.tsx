import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "../ui/card";

export function InfoCard({ icon: Icon, title, description, actionText, onActionClick }: any) {
    return (
        <Card className="border border-cuidarte-tertiary shadow-md">
            <CardHeader className="flex justify-center items-center flex-col space-y-2">
                <Icon />
                <CardTitle className="text-center">{title}</CardTitle>
                <CardDescription className="text-center text-cuidarte-primary text-xl">{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <CardAction className="flex justify-center w-full" onClick={onActionClick}>
                    {actionText}
                </CardAction>
            </CardFooter>
        </Card>
    );
}
