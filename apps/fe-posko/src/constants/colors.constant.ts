/**
 * Created Date       : 31-03-2026
 * Description        : Deklarasi konstanta warna terpusat yang berisi mapping properti ke semantic tokens.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Aligment dengan fe-pusat dan standardisasi header.
 */
export const outlineColor = {
	success: "outline-btn-success",
	warning: "outline-yellow",
	siaga: "outline-btn-warning",
	danger: "outline-btn-error",
	off: "outline-neutral-2",
	neutral: "outline-neutral-1"
};

export const textColor = {
	success: "text-btn-success",
	warning: "text-yellow",
	siaga: "text-btn-warning",
	danger: "text-btn-error",
	off: "text-neutral-2",
	neutral: "text-neutral-1"
};

export const bgColor = {
	success: "bg-btn-success",
	warning: "bg-yellow",
	siaga: "bg-btn-warning",
	danger: "bg-btn-error",
	off: "bg-neutral-2",
	neutral: "bg-neutral-1"
};

/** Mapping warna label dan border berdasarkan tipe status log. */
export const statusColorMap = {
	success: { tagColor: "bg-[#22c55e]", borderColor: "border-[#22c55e]" },
	warning: { tagColor: "bg-[#f59e0b]", borderColor: "border-[#f59e0b]" },
	danger: { tagColor: "bg-[#ef4444]", borderColor: "border-[#ef4444]" },
	neutral: { tagColor: "bg-[#94a3b8]", borderColor: "border-[#94a3b8]" },
	system: { tagColor: "bg-[#64748b]", borderColor: "border-[#64748b]" }
};
