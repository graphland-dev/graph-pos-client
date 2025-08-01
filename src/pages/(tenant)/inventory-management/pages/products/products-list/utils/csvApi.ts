import { TokenService } from "@/commons/utils/TokenService";
import axios from "axios";

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL
}/api/inventory/products/csv`;

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export interface ValidationResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  createdCount: number;
  updatedCount: number;
  errorCount: number;
  errors: ValidationError[];
}

export interface ImportApiPayload {
  tenantUID: string;
  updateExisting?: boolean;
  previewOnly?: boolean;
  matchField?: string;
}

export interface DownloadTempltaeAPIResponse {
  success: boolean;
  file: {
    provider: string;
    url: string;
    path: string;
  };
  totalRecords: number;
}

export interface ExportApiPayload {
  tenantUID: string;
  fields?: string[];
  categoryId?: string;
  brandId?: string;
  includeRelatedData?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface ExportResult {
  success: boolean;
  file: {
    provider: string;
    url: string;
    path: string;
    meta: string;
  };
  totalRecords: number;
}

export const downloadCSVTemplate = async (): Promise<void> => {
  try {
    const response = await axios.get<DownloadTempltaeAPIResponse>(
      `${API_BASE_URL}/template`,
      {
        headers: {
          Authorization: `Bearer ${TokenService.getToken()}`,
        },
      }
    );

    const fileUrl = response.data.file.url;
    axios
      .get(fileUrl, {
        responseType: "blob",
      })
      .then((fileResponse) => {
        const blob = new Blob([fileResponse.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  } catch (error) {
    console.error("Failed to download template:", error);
    throw error;
  }
};

export const validateCSVFile = async (
  file: File,
  tenantUID: string,
  matchField = "code"
): Promise<ValidationResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("matchField", matchField);

    const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${TokenService.getToken()}`,
        "x-tenant": tenantUID,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to validate CSV:", error);
    throw error;
  }
};

export const importCSVFile = async (
  file: File,
  options: ImportApiPayload
): Promise<ValidationResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (options.updateExisting !== undefined) {
      formData.append("updateExisting", options.updateExisting.toString());
    }

    if (options.previewOnly !== undefined) {
      formData.append("previewOnly", options.previewOnly.toString());
    }

    if (options.matchField) {
      formData.append("matchField", options.matchField);
    }

    const response = await axios.post(`${API_BASE_URL}/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${TokenService.getToken()}`,
        "x-tenant": options.tenantUID,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to import CSV:", error);
    throw error;
  }
};

export const exportCSVFile = async (
  options: ExportApiPayload
): Promise<ExportResult> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/export`,
      {
        // fields: options.fields || ["name", "code", "price", "stockInQuantity"],
        categoryId: options.categoryId,
        brandId: options.brandId,
        includeRelatedData: options.includeRelatedData || true,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-tenant": options.tenantUID,
          Authorization: `Bearer ${TokenService.getToken()}`,
        },
      }
    );

    const result: ExportResult = response.data;

    if (result.success && result.file) {
      // Download the file from the provided path
      const fileUrl = result.file.url;
      const fileResponse = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const blob = new Blob([fileResponse.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        result.file.path.split("/").pop() || "exported-products.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    return result;
  } catch (error) {
    console.error("Failed to export CSV:", error);
    throw error;
  }
};
