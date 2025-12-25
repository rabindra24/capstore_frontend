import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail } from "lucide-react";
import { emailTemplates, templateCategories, EmailTemplate } from "@/constants/emailTemplates";

type TemplateSelectDialogProps = {
    onSelectTemplate: (template: EmailTemplate) => void;
};

export function TemplateSelectDialog({ onSelectTemplate }: TemplateSelectDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

    const filteredTemplates = Object.values(emailTemplates).filter((template) => {
        if (selectedCategory === "all") return true;
        return template.category === selectedCategory;
    });

    const handleSelectTemplate = (template: EmailTemplate) => {
        onSelectTemplate(template);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Use Template
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Email Templates</DialogTitle>
                    <DialogDescription>
                        Choose from professional ecommerce email templates
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Category:</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {templateCategories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTemplates.map((template, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer hover:border-primary transition-colors"
                                onClick={() => setPreviewTemplate(template)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Mail className="w-5 h-5" />
                                        {template.name}
                                    </CardTitle>
                                    <CardDescription>{template.preview}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        <strong>Subject:</strong> {template.subject}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {template.variables.slice(0, 4).map((variable) => (
                                            <span
                                                key={variable}
                                                className="text-xs bg-secondary px-2 py-1 rounded"
                                            >
                                                {`{{${variable}}}`}
                                            </span>
                                        ))}
                                        {template.variables.length > 4 && (
                                            <span className="text-xs text-muted-foreground px-2 py-1">
                                                +{template.variables.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectTemplate(template);
                                        }}
                                    >
                                        Use This Template
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Preview Dialog */}
                    {previewTemplate && (
                        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{previewTemplate.name} - Preview</DialogTitle>
                                    <DialogDescription>
                                        Subject: {previewTemplate.subject}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Available Variables:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {previewTemplate.variables.map((variable) => (
                                                <code
                                                    key={variable}
                                                    className="text-xs bg-secondary px-2 py-1 rounded"
                                                >
                                                    {`{{${variable}}}`}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Preview:</h4>
                                        <div
                                            className="border rounded-lg p-4 bg-gray-50"
                                            dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            handleSelectTemplate(previewTemplate);
                                            setPreviewTemplate(null);
                                        }}
                                    >
                                        Use This Template
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
