import {useState} from 'react';
import {Button, Label, Input} from '../ui';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {toast} from 'sonner';
import {Image as LucideImage} from 'lucide-react';
import {useAtom} from 'jotai';
import {configAtom} from '../../utils/atoms';
import {
  saveConfig as saveConfigPreload,
  updateBrandConfig as updateBrandConfigPreload,
  saveBrandImage as saveBrandImagePreload,
} from '#preload';

export const BrandSettings = () => {
  const [config, setConfig] = useAtom(configAtom);
  const [brandName, setBrandName] = useState(config.brandName);
  const [loading, setLoading] = useState(false);

  const saveConfig = async () => {
    try {
      if (!config.brandName) {
        toast.info('Please enter a brand name');
        return;
      }

      setConfig(prev => ({...prev, brandName}));
      await saveConfigPreload({
        ...config,
        brandName,
      });
      updateBrandConfigPreload();

      toast.success('Vercel config saved successfully!');
    } catch (error) {
      console.error(error);
    }
  };
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async loadEvent => {
        try {
          const buffer = Buffer.from(loadEvent.target?.result as ArrayBuffer);
          const brandImage = await saveBrandImagePreload(buffer);

          setConfig(prev => ({...prev, brandImage}));
          await saveConfigPreload({
            ...config,
            brandImage,
          });
          updateBrandConfigPreload();
          toast.success('Brand image saved successfully!');
        } catch (error) {
          const err = new String(error);
          toast.error(err);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
          <CardDescription>
            Use this section to configure your brand. This includes your brand name, logo, and other
            branding details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Brand Name</Label>
            <Input
              id="brandName"
              name="Brand Name"
              placeholder="Enter Brand Name"
              value={config?.brandName}
              onChange={e => setBrandName(e.target.value)}
            />
          </div>
          <div
            className="flex items-center flex-col gap-4 bg-accent p-4 rounded-md cursor-pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {config.brandImage ? (
              <img
                key={config.brandImage}
                src={`media://${config.brandImage}`}
                alt="Brand Logo"
                width={100}
                height={100}
              />
            ) : (
              <div className="flex items-center flex-col gap-4 bg-accent p-4 rounded-md cursor-pointer">
                <LucideImage />
                <Label>Upload Logo</Label>
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={saveConfig}
            disabled={loading}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
