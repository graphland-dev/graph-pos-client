import React, { useState } from "react";
import {
  Button,
  Modal,
  Text,
  Group,
  Stack,
  Alert,
  List,
  Progress,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDownload,
  IconUpload,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconFile,
} from "@tabler/icons-react";
import { confirmModal } from "@/commons/components/confirm";
import {
  downloadCSVTemplate,
  validateCSVFile,
  importCSVFile,
  exportCSVFile,
} from "./utils/csvApi";
import { useParams } from "react-router-dom";

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: string;
}

interface ValidationResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  createdCount: number;
  updatedCount: number;
  errorCount: number;
  errors: ValidationError[];
}

const ImportExportCSV: React.FC = () => {
  const [importOpened, { open: openImport, close: closeImport }] =
    useDisclosure(false);

  const params = useParams<{ tenant: string }>();

  const [importFile, setImportFile] = useState<FileWithPath | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const handleTemplateDownload = async () => {
    setIsDownloadingTemplate(true);
    try {
      await downloadCSVTemplate();
    } catch (error) {
      console.error("Template download failed:", error);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleFileValidation = async (file: FileWithPath) => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateCSVFile(file, params.tenant || "");
      setValidationResult(result);
      setImportFile(file);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!importFile || !validationResult) return;

    setIsImporting(true);
    try {
      const result = await importCSVFile(importFile, {
        updateExisting: true,
        previewOnly: false,
        matchField: "code",
        tenantUID: params.tenant || "",
      });

      if (result.success) {
        closeImport();
        setImportFile(null);
        setValidationResult(null);
        // Optionally refresh the product list here
      }
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    confirmModal({
      title: "Export Products to CSV",
      description:
        "This will export all products to a CSV file. Do you want to continue?",
      onConfirm: async () => {
        setIsExporting(true);
        try {
          await exportCSVFile({
            tenantUID: params.tenant || "",
          });
        } catch (error) {
          console.error("Export failed:", error);
        } finally {
          setIsExporting(false);
        }
      },
    });
  };

  const resetImportState = () => {
    setImportFile(null);
    setValidationResult(null);
  };

  return (
    <>
      <Group spacing="sm">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<IconUpload size={16} />}
          onClick={openImport}
        >
          Import
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<IconDownload size={16} />}
          onClick={handleExport}
          loading={isExporting}
        >
          Export
        </Button>
      </Group>

      {/* Import Modal */}
      <Modal
        opened={importOpened}
        onClose={() => {
          closeImport();
          resetImportState();
        }}
        title="Import Products from CSV"
        size="lg"
      >
        <Stack spacing="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
            <Text size="sm">
              Before importing, please ensure your CSV file follows the correct
              format. Download the template below to see the required structure.
            </Text>
          </Alert>

          <Group>
            <Button
              variant="light"
              leftIcon={<IconDownload size={16} />}
              onClick={handleTemplateDownload}
              loading={isDownloadingTemplate}
            >
              Download CSV Template
            </Button>
          </Group>

          <Text weight={600}>Instructions:</Text>
          <List size="sm">
            <List.Item>Only 'name' field is required</List.Item>
            <List.Item>
              Use 'code' field to update existing products (if updateExisting is
              enabled)
            </List.Item>
            <List.Item>
              Category, brand, unit, and VAT codes must exist in the system
            </List.Item>
            <List.Item>
              Discount mode should be either 'PERCENTAGE' or 'AMOUNT'
            </List.Item>
            <List.Item>
              Tax type should be either 'INCLUSIVE' or 'EXCLUSIVE'
            </List.Item>
          </List>

          <Dropzone
            onDrop={(files) => {
              const file = files[0];
              if (file) {
                handleFileValidation(file);
              }
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={10 * 1024 * 1024} // 10MB
            accept={{
              "text/csv": [".csv"],
            }}
            multiple={false}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 120, pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload size="3.2rem" stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size="3.2rem" stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFile size="3.2rem" stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag CSV file here or click to select
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  File should not exceed 10MB
                </Text>
              </div>
            </Group>
          </Dropzone>

          {isValidating && (
            <Stack spacing="xs">
              <Text size="sm">Validating CSV file...</Text>
              <Progress value={100} animate />
            </Stack>
          )}

          {validationResult && (
            <Stack spacing="md">
              <Alert
                icon={
                  validationResult.success ? (
                    <IconCheck size="1rem" />
                  ) : (
                    <IconX size="1rem" />
                  )
                }
                title="Validation Result"
                color={
                  validationResult.success && validationResult.errorCount === 0
                    ? "green"
                    : "yellow"
                }
              >
                <Stack spacing="xs">
                  <Text size="sm">
                    Total rows: {validationResult.totalRows}
                  </Text>
                  <Text size="sm">
                    Processed rows: {validationResult.processedRows}
                  </Text>
                  {validationResult.errorCount > 0 && (
                    <Text size="sm" color="red">
                      Errors found: {validationResult.errorCount}
                    </Text>
                  )}
                </Stack>
              </Alert>

              {validationResult.errors.length > 0 && (
                <Stack spacing="xs">
                  <Text weight={600} size="sm" color="red">
                    Validation Errors:
                  </Text>
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {validationResult.errors.map((error, index) => (
                      <Alert key={index} color="red" variant="light" p="xs">
                        <Text size="xs">
                          Row {error.row}, Field '{error.field}':{" "}
                          {error.message}
                          {error.value && ` (Value: "${error.value}")`}
                        </Text>
                      </Alert>
                    ))}
                  </div>
                </Stack>
              )}

              {validationResult.success && (
                <Group position="right">
                  <Button
                    onClick={handleImport}
                    loading={isImporting}
                    disabled={validationResult.errorCount > 0}
                  >
                    Import Products
                  </Button>
                </Group>
              )}
            </Stack>
          )}
        </Stack>
      </Modal>
    </>
  );
};

export default ImportExportCSV;
