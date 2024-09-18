import { Paper, Space } from "@mantine/core";

const DesignSystem = () => {
  return (
    <div className="p-20 ">
      <Paper shadow="md" p={10} withBorder>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, rem
          similique, eveniet labore veritatis sunt porro nulla placeat nemo
          blanditiis nobis omnis voluptates nesciunt eaque eos dicta corporis
          facilis repellendus!
        </p>
      </Paper>

      <Space h={20} />

      <Paper shadow="md" p={0} withBorder className="overflow-hidden">
        <p className="px-2 py-2 bg-card-header">Header</p>
        <div className="p-2">
          <p className="text-text-gray">Text 2</p>
          <p className="text-text-muted">Text 3</p>
        </div>
      </Paper>
    </div>
  );
};

export default DesignSystem;
