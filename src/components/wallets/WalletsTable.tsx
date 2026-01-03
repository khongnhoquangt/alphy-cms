import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from "lucide-react";
import { WalletTypeBadge, type WalletType } from "./WalletTypeBadge";
import { DataTable } from "@/components/ui/data-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.ts";
import { GET_WALLET_TRACKING } from "@/query/useGetWalletTracking.ts";
import { GET_SUMMARY } from "@/query/useGetSummary.ts";
import { toast } from "sonner";

export interface Wallet {
  id: number;
  pictureUrl?: string;
  name: string;
  address: string;
  type: WalletType;
  description: string;
  x_url: string;
}

interface WalletsTableProps {
  wallets: Wallet[];
  onEdit: (wallet: Wallet) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export function WalletsTable({
  wallets,
  onEdit,
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 7,
}: WalletsTableProps) {
  // Column definitions for the DataTable
  const columns: ColumnDef<Wallet>[] = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
      size: 48,
    },
    {
      accessorKey: "pictureUrl",
      header: "Profile pic",
      cell: ({ row }) => {
        const wallet = row.original;
        return wallet.pictureUrl ? (
          <img
            src={wallet.pictureUrl}
            alt={wallet.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
        );
      },
    },

    {
      accessorKey: "address",
      header: "Wallet address",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.address || "-"}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <WalletTypeBadge type={row.original.type} />,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="max-w-xs truncate block">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "x_url",
      header: "X account",
      cell: ({ row }) => row.original.x_url || "-",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(wallet)}>
              Edit
            </Button>
            <span className="text-muted-foreground">/</span>
            <DeleteButton wallet={wallet} />
          </div>
        );
      },
    },
  ];

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Card>
      <DataTable
        columns={columns}
        data={wallets}
        pagination={{
          pageIndex: currentPage - 1,
          pageSize,
          pageCount: totalPages,
          onPageChange: (page) => onPageChange(page + 1),
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}

const DeleteButton = ({ wallet }: { wallet: Wallet }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await api.delete(`/user/wallet-tracking/${wallet.address}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_WALLET_TRACKING],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_SUMMARY],
      });
      toast.success("Wallet deleted successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return (
    <Button
      onClick={() => mutate()}
      disabled={isPending}
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700"
    >
      Delete
    </Button>
  );
};
