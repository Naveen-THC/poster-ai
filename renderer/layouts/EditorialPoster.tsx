import { Group, Rect, Text } from "react-konva";

export default function EditorialPoster({
  content,
  theme,
}: any) {
  return (
    <Group>

      <Rect
        width={1024}
        height={1024}
        fill={theme.secondary}
      />

      <Text
        x={60}
        y={60}
        width={600}
        text={content.title}
        fontSize={48}
        fontStyle="bold"
      />

      <Text
        x={60}
        y={140}
        width={600}
        text={content.subtitle}
        fontSize={24}
      />

    </Group>
  );
}