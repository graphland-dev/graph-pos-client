import { Client } from "@/commons/graphql-models/graphql";
import { Button, Card, Group, Text, TextInput, LoadingOverlay } from "@mantine/core";
import { IconMail, IconPhone, IconMapPin, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";

interface ClientsCardListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  totalCount?: number;
}

const ClientsCardList = ({ 
  clients, 
  onClientSelect, 
  onSearch, 
  loading = false, 
  totalCount = 0 
}: ClientsCardListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch?.(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    setSearchQuery(query);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <TextInput
        placeholder="Search clients by name, email, or contact number..."
        value={searchQuery}
        onChange={handleSearchChange}
        icon={<IconSearch size={16} />}
        size="md"
      />

      {/* Results Count */}
      {totalCount > 0 && (
        <Text size="sm" color="dimmed">
          Showing {clients.length} of {totalCount} client{totalCount === 1 ? '' : 's'}
        </Text>
      )}

      {/* Loading State */}
      <div style={{ position: 'relative', minHeight: loading ? '200px' : 'auto' }}>
        <LoadingOverlay visible={loading} />
        
        {/* Results */}
        {!loading && clients.length === 0 ? (
          <Text color="dimmed" align="center" py="xl">
            {debouncedSearchQuery ? 'No clients match your search.' : 'No clients found. Create a new client to get started.'}
          </Text>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ClientsCardList;