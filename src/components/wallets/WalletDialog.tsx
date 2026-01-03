import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Wallet } from "./WalletsTable";
import type { WalletType } from "./WalletTypeBadge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.ts";
import { GET_WALLET_TRACKING } from "@/query/useGetWalletTracking.ts";
import { toast } from "sonner";
import { GET_SUMMARY } from "@/query/useGetSummary.ts";

interface WalletFormData {
  address: string;
  type: WalletType | "";
  pictureUrl?: string;
  description: string;
  x_url: string;
}

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWallet: Wallet | null;
}

export function WalletDialog({
  open,
  onOpenChange,
  editingWallet,
}: WalletDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<WalletFormData>({
    address: "",
    type: "",
    pictureUrl: "",
    description: "",
    x_url: "",
  });

  useEffect(() => {
    setFormData(getInitialFormData(editingWallet));
  }, [editingWallet]);
  // Reset form when dialog opens/closes or editing wallet changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData(getInitialFormData(editingWallet));
    }
    onOpenChange(newOpen);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (editingWallet) {
        await api.put(`/user/wallet-tracking/${editingWallet.address}`, {
          type: formData.type,
          pictureUrl: formData.pictureUrl,
          description: formData.description,
          x_url: formData.x_url,
        });
      } else {
        await api.post(`/user/wallet-tracking`, formData);
      }
    },
    onSuccess: () => {
      handleOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: [GET_WALLET_TRACKING],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_SUMMARY],
      });
      toast.success("Wallet added successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingWallet ? "Edit wallet" : "Add new wallet to tracking"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!editingWallet && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Wallet address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="col-span-3"
                placeholder="0x..."
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as WalletType })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select: KOL, Whale, Good trader, Insider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KOL">KOL</SelectItem>
                <SelectItem value="Whale">Whale</SelectItem>
                <SelectItem value="Good trader">Good trader</SelectItem>
                <SelectItem value="Insider">Insider</SelectItem>
                <SelectItem value="Excellent trader">
                  Excellent trader
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pictureUrl" className="text-right">
              Profile pic
            </Label>
            <div className="col-span-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Input
                  id="profilePic"
                  value={formData.pictureUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, pictureUrl: e.target.value })
                  }
                  className="flex-1"
                  placeholder="Url"
                />
                {formData.pictureUrl && (
                  <img
                    src={formData.pictureUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-3"
              placeholder="write here"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="x_url" className="text-right">
              X
            </Label>
            <Input
              id="x_url"
              value={formData.x_url}
              onChange={(e) =>
                setFormData({ ...formData, x_url: e.target.value })
              }
              className="col-span-3"
              placeholder="url"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => mutate()} disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getInitialFormData(wallet: Wallet | null): WalletFormData {
  if (wallet) {
    return {
      address: wallet.address,
      type: wallet.type,
      pictureUrl: wallet.pictureUrl,
      description: wallet.description,
      x_url: wallet.x_url,
    };
  }
  return {
    address: "",
    type: "",
    pictureUrl: "",
    description: "",
    x_url: "",
  };
}

export type { WalletFormData };
