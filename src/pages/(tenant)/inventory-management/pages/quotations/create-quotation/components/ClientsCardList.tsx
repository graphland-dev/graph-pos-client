import { Client } from "@/commons/graphql-models/graphql";
import { Button, Card, Group, Text } from "@mantine/core";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

interface ClientsCardListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
}

const ClientsCardList = ({ clients, onClientSelect }: ClientsCardListProps) => {
  if (clients.length === 0) {
    return (
      <Text color="dimmed" align="center" py="xl">
        No clients found. Create a new client to get started.
      </Text>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <Card key={client._id} withBorder p="md" className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Text weight={600} size="md" mb="xs">
                {client.name}
              </Text>
              
              <div className="space-y-1">
                {client.email && (
                  <Group spacing="xs">
                    <IconMail size={14} color="gray" />
                    <Text size="sm" color="dimmed">
                      {client.email}
                    </Text>
                  </Group>
                )}
                
                {client.contactNumber && (
                  <Group spacing="xs">
                    <IconPhone size={14} color="gray" />
                    <Text size="sm" color="dimmed">
                      {client.contactNumber}
                    </Text>
                  </Group>
                )}
                
                {client.address && (
                  <Group spacing="xs">
                    <IconMapPin size={14} color="gray" />
                    <Text size="sm" color="dimmed">
                      {client.address}
                    </Text>
                  </Group>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={() => onClientSelect(client)}
            >
              Select
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ClientsCardList;