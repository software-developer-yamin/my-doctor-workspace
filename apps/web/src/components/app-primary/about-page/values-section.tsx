import { SectionHeader } from "@/components/common/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ABOUT_VALUES_DATA } from "@/data/about.data";

export const ValuesSection = () => {
  return (
    <section className="bg-muted/50 -mx-4 px-4 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label={ABOUT_VALUES_DATA.label}
          title={ABOUT_VALUES_DATA.title}
          align="left"
          centeredOnMobile={true}
          className="mb-12"
        />
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {ABOUT_VALUES_DATA.items.map((item) => (
            <Card
              key={item.id}
              className="border-none bg-transparent shadow-none"
            >
              <CardHeader className="items-center space-y-4 pb-2 sm:items-start">
                <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold sm:ml-0">
                  {item.number}
                </div>
                <CardTitle className="text-foreground text-center text-xl font-bold sm:text-left">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center sm:text-left">
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
