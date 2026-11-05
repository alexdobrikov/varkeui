/** One document listener, one image recipient. Never steal paste from an editor. */
export function isEditingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    !!target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="searchbox"], [role="combobox"]',
    )
  );
}

type Recipient = { element: HTMLElement; ready: () => boolean; select: (file: File) => void };
type Registration = Recipient & { lastUsed: number };
const registries = new WeakMap<Document, { add: (recipient: Recipient) => () => void }>();

export function registerPagePaste(recipient: Recipient): () => void {
  const doc = recipient.element.ownerDocument;
  let registry = registries.get(doc);
  if (!registry) {
    const recipients = new Set<Registration>();
    let clock = 0;
    const remember = (event: Event) => {
      for (const entry of recipients) {
        if (event.target instanceof Node && entry.element.contains(event.target))
          entry.lastUsed = ++clock;
      }
    };
    const handlePaste = (event: ClipboardEvent) => {
      if (
        event.defaultPrevented ||
        isEditingTarget(event.target) ||
        isEditingTarget(doc.activeElement)
      )
        return;
      const image = Array.from(event.clipboardData?.items ?? [])
        .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
        ?.getAsFile();
      if (!image) return;
      const dialogs = doc.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"]');
      const topDialog = dialogs[dialogs.length - 1];
      const candidates = [...recipients].filter(({ element }) => {
        if (!element.isConnected || element.closest('[hidden], [inert], dialog:not([open])'))
          return false;
        if (topDialog && !topDialog.contains(element)) return false;
        const style = doc.defaultView?.getComputedStyle(element);
        if (style?.visibility === 'hidden' || style?.display === 'none') return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < (doc.defaultView?.innerHeight ?? Infinity) &&
          rect.left < (doc.defaultView?.innerWidth ?? Infinity)
        );
      });
      candidates.sort(
        (a, b) =>
          b.lastUsed - a.lastUsed ||
          (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1),
      );
      const selected = candidates[0];
      // A repeated paste while this recipient is busy must not fill the next field instead.
      if (!selected?.ready()) return;
      selected.lastUsed = ++clock;
      event.preventDefault();
      selected.select(image);
    };
    doc.addEventListener('paste', handlePaste);
    doc.addEventListener('focusin', remember);
    doc.addEventListener('pointerdown', remember);
    registry = {
      add(entry) {
        const registered = { ...entry, lastUsed: 0 };
        recipients.add(registered);
        return () => {
          recipients.delete(registered);
          if (recipients.size) return;
          doc.removeEventListener('paste', handlePaste);
          doc.removeEventListener('focusin', remember);
          doc.removeEventListener('pointerdown', remember);
          registries.delete(doc);
        };
      },
    };
    registries.set(doc, registry);
  }
  return registry.add(recipient);
}
