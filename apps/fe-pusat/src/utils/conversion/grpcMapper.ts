import { DisasterReport } from "@store/useDisasterStore";

/**
 * Memetakan Objek Class gRPC (yang dihasilkan google-protobuf dari .proto)
 * menjadi Objek Plain JavaScript (Interface) agar ringan dan ramah untuk dimasukkan
 * ke dalam reaktif state management Zustand maupun React Props.
 * 
 * Catatan: Objek hasil compile .proto JavaScript murni dari perintah "toObject()"
 * punya format parameter bawaan camelCase yang di-generate gRPC.
 *
 * @param {any} grpcObject - Parameter yang dikirim dari `.toObject()` class message DisasterReport.
 * @returns {DisasterReport} Data murni yang siap dihantam ke State.
 */
export const mapGrpcReportToState = (grpcObject: any): DisasterReport => {
	if (!grpcObject) return {} as DisasterReport;

	return {
		id: grpcObject.id || "",
		originId: grpcObject.originId || "",
		sourceName: grpcObject.sourceName || "",
		latitude: grpcObject.latitude || "",
		longitude: grpcObject.longitude || "",
		bencanaType: grpcObject.bencanaType || "",
		statusLevel: grpcObject.statusLevel || 0,
		statusPenanganan: grpcObject.statusPenanganan || 0,
		observationDetail: grpcObject.observationDetail || "",
		timestamp: grpcObject.timestamp || new Date().toISOString()
	};
};
